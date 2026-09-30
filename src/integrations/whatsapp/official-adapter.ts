/**
 * Official WhatsApp Cloud API adapter.
 *
 * Calls the Meta Graph API to send messages and verifies inbound
 * webhook signatures using HMAC-SHA256.
 *
 * Configuration is read from a WhatsAppConfig object supplied at
 * construction time. In production the values come from environment
 * variables; see provider.ts for the wiring.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import type {
  WhatsAppProvider,
  WhatsAppConfig,
  WhatsAppMessage,
  WhatsAppSendResult,
  WhatsAppWebhookPayload,
  ParsedWebhookResult,
} from './types';

const DEFAULT_API_VERSION = 'v21.0';
const BASE_URL = 'https://graph.facebook.com';

class OfficialWhatsAppAdapter implements WhatsAppProvider {
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly appSecret: string;
  private readonly baseUrl: string;

  constructor(config: WhatsAppConfig) {
    this.accessToken = config.accessToken;
    this.phoneNumberId = config.phoneNumberId;
    this.appSecret = config.appSecret;
    const version = config.apiVersion ?? DEFAULT_API_VERSION;
    this.baseUrl = `${BASE_URL}/${version}`;
  }

  // -----------------------------------------------------------------------
  // Sending
  // -----------------------------------------------------------------------

  async sendMessage(msg: WhatsAppMessage): Promise<WhatsAppSendResult> {
    const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

    let payload: Record<string, unknown>;

    switch (msg.messageType) {
      case 'template':
        payload = this.buildTemplatePayload(msg);
        break;
      case 'text':
        payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: msg.to,
          type: 'text',
          text: { preview_url: false, body: msg.body ?? '' },
        };
        break;
      case 'interactive':
        // Interactive messages require caller-supplied structure in body.
        payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: msg.to,
          type: 'interactive',
          interactive: msg.body ? JSON.parse(msg.body) : {},
        };
        break;
      default:
        return { success: false, error: `Unsupported message type: ${msg.messageType}` };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const errorDetail =
          (data as { error?: { message?: string } }).error?.message ??
          `HTTP ${response.status}`;
        return { success: false, error: errorDetail };
      }

      const messages = data.messages as Array<{ id: string }> | undefined;
      const messageId = messages?.[0]?.id;
      return { success: true, messageId };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown send error';
      return { success: false, error: message };
    }
  }

  async sendTemplate(
    to: string,
    templateName: string,
    params: string[],
    languageCode = 'en',
  ): Promise<WhatsAppSendResult> {
    return this.sendMessage({
      to,
      messageType: 'template',
      templateName,
      templateParams: params,
      languageCode,
    });
  }

  // -----------------------------------------------------------------------
  // Webhook signature verification
  // -----------------------------------------------------------------------

  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    secret: string,
  ): boolean {
    if (!signature || !secret) return false;

    // The header value is "sha256=<hex>".
    const expectedPrefix = 'sha256=';
    if (!signature.startsWith(expectedPrefix)) return false;

    const signatureHash = signature.slice(expectedPrefix.length);
    const computedHash = createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    try {
      return timingSafeEqual(
        Buffer.from(signatureHash, 'hex'),
        Buffer.from(computedHash, 'hex'),
      );
    } catch {
      // Length mismatch or encoding error means the signature is invalid.
      return false;
    }
  }

  // -----------------------------------------------------------------------
  // Webhook parsing
  // -----------------------------------------------------------------------

  parseWebhookPayload(body: WhatsAppWebhookPayload): ParsedWebhookResult {
    const result: ParsedWebhookResult = { messages: [], statuses: [] };

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        if (!value) continue;

        const contactsByWaId = new Map<string, string>();
        for (const contact of value.contacts ?? []) {
          contactsByWaId.set(contact.wa_id, contact.profile.name);
        }

        for (const msg of value.messages ?? []) {
          result.messages.push({
            from: msg.from,
            messageId: msg.id,
            timestamp: msg.timestamp,
            type: msg.type,
            text: msg.text?.body,
            contactName: contactsByWaId.get(msg.from),
          });
        }

        for (const status of value.statuses ?? []) {
          result.statuses.push({
            messageId: status.id,
            status: status.status,
            timestamp: status.timestamp,
            recipientId: status.recipient_id,
            errorCode: status.errors?.[0]?.code,
            errorTitle: status.errors?.[0]?.title,
          });
        }
      }
    }

    return result;
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  private buildTemplatePayload(msg: WhatsAppMessage): Record<string, unknown> {
    const components: Record<string, unknown>[] = [];

    if (msg.templateParams && msg.templateParams.length > 0) {
      components.push({
        type: 'body',
        parameters: msg.templateParams.map((value) => ({
          type: 'text',
          text: value,
        })),
      });
    }

    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: msg.to,
      type: 'template',
      template: {
        name: msg.templateName,
        language: { code: msg.languageCode ?? 'en' },
        components,
      },
    };
  }
}

/**
 * Factory function to create an official adapter instance.
 *
 * Prefer using `getWhatsAppProvider()` from `./provider` which
 * reads environment variables automatically.
 */
export function createOfficialAdapter(config: WhatsAppConfig): WhatsAppProvider {
  return new OfficialWhatsAppAdapter(config);
}
