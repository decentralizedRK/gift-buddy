import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHmac } from 'crypto';

import { fakeWhatsAppAdapter } from '@/integrations/whatsapp/fake-adapter';
import { createOfficialAdapter } from '@/integrations/whatsapp/official-adapter';
import { getTemplateMapping, TEMPLATE_MAPPINGS } from '@/integrations/whatsapp/templates';
import {
  processWebhook,
  deriveIdempotencyKey,
  _resetIdempotencyStore,
} from '@/integrations/whatsapp/webhook-handler';
import type {
  WhatsAppWebhookPayload,
  ParsedWebhookMessage,
  ParsedWebhookStatus,
} from '@/integrations/whatsapp/types';
import type { Order } from '@/domain/order';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function buildWebhookPayload(
  overrides: Partial<{
    messages: WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages'];
    statuses: WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['statuses'];
    contacts: WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['contacts'];
  }> = {},
): WhatsAppWebhookPayload {
  return {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '+1234567890',
                phone_number_id: 'pn_123',
              },
              contacts: overrides.contacts ?? [
                { profile: { name: 'Test User' }, wa_id: '919876543210' },
              ],
              messages: overrides.messages ?? [
                {
                  from: '919876543210',
                  id: 'wamid.test123',
                  timestamp: '1696000000',
                  type: 'text',
                  text: { body: 'Hello from test' },
                },
              ],
              statuses: overrides.statuses,
            },
            field: 'messages',
          },
        ],
      },
    ],
  };
}

function buildSampleOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'ord_001',
    referenceNumber: 'GB-2024-001',
    status: 'inquiry_received',
    items: [],
    companyName: 'Acme Corp',
    contactName: 'Jane Doe',
    phone: '+919876543210',
    email: 'jane@acme.example',
    quantity: 50,
    addresses: ['123 Main St'],
    subtotal: 250000, // 2500.00 INR in paise
    currency: 'INR' as const,
    consentGiven: true,
    idempotencyKey: 'idem_001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    ...overrides,
  };
}

const APP_SECRET = 'test_app_secret_value';

function signPayload(body: string, secret: string): string {
  const hash = createHmac('sha256', secret).update(body).digest('hex');
  return `sha256=${hash}`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('WhatsApp Integration', () => {
  beforeEach(() => {
    _resetIdempotencyStore();
  });

  // -------------------------------------------------------------------------
  // Fake adapter
  // -------------------------------------------------------------------------

  describe('FakeWhatsAppAdapter', () => {
    it('sendMessage returns success with a generated messageId', async () => {
      const result = await fakeWhatsAppAdapter.sendMessage({
        to: '+919876543210',
        messageType: 'text',
        body: 'Hello!',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.messageId).toMatch(/^fake_wamid_/);
    });

    it('sendTemplate returns success', async () => {
      const result = await fakeWhatsAppAdapter.sendTemplate(
        '+919876543210',
        'gift_buddy_inquiry_received',
        ['Jane', 'GB-2024-001', 'Acme Corp'],
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('verifyWebhookSignature always returns true', () => {
      expect(
        fakeWhatsAppAdapter.verifyWebhookSignature('body', 'sig', 'secret'),
      ).toBe(true);
    });

    it('parseWebhookPayload extracts messages', () => {
      const payload = buildWebhookPayload();
      const parsed = fakeWhatsAppAdapter.parseWebhookPayload(payload);

      expect(parsed.messages).toHaveLength(1);
      expect(parsed.messages[0].from).toBe('919876543210');
      expect(parsed.messages[0].text).toBe('Hello from test');
      expect(parsed.messages[0].contactName).toBe('Test User');
    });

    it('parseWebhookPayload extracts statuses', () => {
      const payload = buildWebhookPayload({
        messages: undefined,
        contacts: undefined,
        statuses: [
          {
            id: 'wamid.sent123',
            status: 'delivered',
            timestamp: '1696000001',
            recipient_id: '919876543210',
          },
        ],
      });
      const parsed = fakeWhatsAppAdapter.parseWebhookPayload(payload);

      expect(parsed.statuses).toHaveLength(1);
      expect(parsed.statuses[0].status).toBe('delivered');
      expect(parsed.statuses[0].messageId).toBe('wamid.sent123');
    });
  });

  // -------------------------------------------------------------------------
  // Official adapter — webhook signature verification
  // -------------------------------------------------------------------------

  describe('OfficialAdapter – signature verification', () => {
    const adapter = createOfficialAdapter({
      accessToken: 'test_token',
      phoneNumberId: 'pn_test',
      appSecret: APP_SECRET,
    });

    it('accepts a valid HMAC-SHA256 signature', () => {
      const body = JSON.stringify(buildWebhookPayload());
      const signature = signPayload(body, APP_SECRET);

      expect(adapter.verifyWebhookSignature(body, signature, APP_SECRET)).toBe(
        true,
      );
    });

    it('rejects an invalid signature', () => {
      const body = JSON.stringify(buildWebhookPayload());

      expect(
        adapter.verifyWebhookSignature(body, 'sha256=deadbeef', APP_SECRET),
      ).toBe(false);
    });

    it('rejects a signature without the sha256= prefix', () => {
      const body = JSON.stringify(buildWebhookPayload());
      const hash = createHmac('sha256', APP_SECRET).update(body).digest('hex');

      expect(adapter.verifyWebhookSignature(body, hash, APP_SECRET)).toBe(
        false,
      );
    });

    it('rejects when secret is empty', () => {
      const body = JSON.stringify(buildWebhookPayload());

      expect(
        adapter.verifyWebhookSignature(body, 'sha256=abc', ''),
      ).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Template parameter extraction
  // -------------------------------------------------------------------------

  describe('Template mappings', () => {
    const order = buildSampleOrder();

    it('inquiry_received extracts contactName, referenceNumber, companyName', () => {
      const mapping = getTemplateMapping('inquiry_received');
      expect(mapping).toBeDefined();
      const params = mapping!.paramExtractor(order);
      expect(params).toEqual(['Jane Doe', 'GB-2024-001', 'Acme Corp']);
    });

    it('quote_ready extracts contactName, referenceNumber, formatted subtotal', () => {
      const mapping = getTemplateMapping('quote_ready');
      expect(mapping).toBeDefined();
      const params = mapping!.paramExtractor(order);
      expect(params[0]).toBe('Jane Doe');
      expect(params[1]).toBe('GB-2024-001');
      // INR 2,500.00
      expect(params[2]).toContain('2,500.00');
    });

    it('order_confirmed extracts contactName, referenceNumber, subtotal, quantity', () => {
      const mapping = getTemplateMapping('order_confirmed');
      expect(mapping).toBeDefined();
      const params = mapping!.paramExtractor(order);
      expect(params).toHaveLength(4);
      expect(params[3]).toBe('50');
    });

    it('dispatched extracts contactName, referenceNumber, tracking ref', () => {
      const mapping = getTemplateMapping('dispatched');
      expect(mapping).toBeDefined();
      const params = mapping!.paramExtractor(order);
      expect(params[0]).toBe('Jane Doe');
      expect(params[1]).toBe('GB-2024-001');
    });

    it('returns undefined for unknown event', () => {
      expect(getTemplateMapping('nonexistent_event')).toBeUndefined();
    });

    it('every defined mapping has a templateName and languageCode', () => {
      for (const [event, mapping] of Object.entries(TEMPLATE_MAPPINGS)) {
        expect(mapping.templateName).toBeTruthy();
        expect(mapping.languageCode).toBe('en');
        expect(typeof mapping.paramExtractor).toBe('function');
      }
    });
  });

  // -------------------------------------------------------------------------
  // Idempotency key derivation
  // -------------------------------------------------------------------------

  describe('Idempotency key derivation', () => {
    it('derives a message key with msg: prefix', () => {
      const msg: ParsedWebhookMessage = {
        from: '919876543210',
        messageId: 'wamid.abc123',
        timestamp: '1696000000',
        type: 'text',
      };
      expect(deriveIdempotencyKey(msg)).toBe('msg:wamid.abc123');
    });

    it('derives a status key with status: prefix including status value', () => {
      const status: ParsedWebhookStatus = {
        messageId: 'wamid.abc123',
        status: 'delivered',
        timestamp: '1696000001',
        recipientId: '919876543210',
      };
      expect(deriveIdempotencyKey(status)).toBe(
        'status:wamid.abc123:delivered',
      );
    });
  });

  // -------------------------------------------------------------------------
  // Webhook processing with idempotency
  // -------------------------------------------------------------------------

  describe('processWebhook – idempotency', () => {
    // Use the fake adapter (default) so signature verification passes.
    const payload = buildWebhookPayload();
    const rawBody = JSON.stringify(payload);

    it('processes a new message exactly once', () => {
      const result = processWebhook(payload, {
        rawBody,
        signature: 'any',
        appSecret: 'any',
      });

      expect(result.messagesProcessed).toBe(1);
      expect(result.duplicatesSkipped).toBe(0);
    });

    it('skips duplicate messages on the second invocation', () => {
      // First call
      processWebhook(payload, {
        rawBody,
        signature: 'any',
        appSecret: 'any',
      });

      // Second call with the same payload
      const result = processWebhook(payload, {
        rawBody,
        signature: 'any',
        appSecret: 'any',
      });

      expect(result.messagesProcessed).toBe(0);
      expect(result.duplicatesSkipped).toBe(1);
    });

    it('processes status updates', () => {
      const statusPayload = buildWebhookPayload({
        messages: undefined,
        contacts: undefined,
        statuses: [
          {
            id: 'wamid.status_test',
            status: 'sent',
            timestamp: '1696000002',
            recipient_id: '919876543210',
          },
        ],
      });

      const result = processWebhook(statusPayload, {
        rawBody: JSON.stringify(statusPayload),
        signature: 'any',
        appSecret: 'any',
      });

      expect(result.statusesProcessed).toBe(1);
    });
  });
});
