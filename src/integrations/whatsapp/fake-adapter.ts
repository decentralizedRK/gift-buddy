/**
 * Fake WhatsApp adapter for local development and testing.
 *
 * Every outbound call is logged to the console with a "[FAKE WHATSAPP]"
 * prefix and returns a synthetic success result. No real messages are sent.
 */

import type {
  WhatsAppProvider,
  WhatsAppMessage,
  WhatsAppSendResult,
  WhatsAppWebhookPayload,
  ParsedWebhookResult,
} from './types';

let messageCounter = 0;

function generateFakeMessageId(): string {
  messageCounter += 1;
  return `fake_wamid_${Date.now()}_${messageCounter}`;
}

function parsePayload(body: WhatsAppWebhookPayload): ParsedWebhookResult {
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

class FakeWhatsAppAdapter implements WhatsAppProvider {
  async sendMessage(msg: WhatsAppMessage): Promise<WhatsAppSendResult> {
    const messageId = generateFakeMessageId();
    console.log(
      `[FAKE WHATSAPP] sendMessage -> to=${msg.to} type=${msg.messageType}` +
        (msg.templateName ? ` template=${msg.templateName}` : '') +
        (msg.body ? ` body="${msg.body.slice(0, 80)}"` : '') +
        ` messageId=${messageId}`,
    );
    return { success: true, messageId };
  }

  async sendTemplate(
    to: string,
    templateName: string,
    params: string[],
    languageCode = 'en',
  ): Promise<WhatsAppSendResult> {
    console.log(
      `[FAKE WHATSAPP] sendTemplate -> to=${to} template=${templateName}` +
        ` params=[${params.join(', ')}] lang=${languageCode}`,
    );
    return this.sendMessage({
      to,
      messageType: 'template',
      templateName,
      templateParams: params,
      languageCode,
    });
  }

  verifyWebhookSignature(
    _rawBody: string,
    _signature: string,
    _secret: string,
  ): boolean {
    console.log('[FAKE WHATSAPP] verifyWebhookSignature -> always true');
    return true;
  }

  parseWebhookPayload(body: WhatsAppWebhookPayload): ParsedWebhookResult {
    console.log('[FAKE WHATSAPP] parseWebhookPayload');
    return parsePayload(body);
  }
}

/** Singleton fake adapter for development use. */
export const fakeWhatsAppAdapter = new FakeWhatsAppAdapter();
