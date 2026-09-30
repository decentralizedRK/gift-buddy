/**
 * WhatsApp Business Platform integration types.
 *
 * These types model the WhatsApp Cloud API message payloads,
 * the provider abstraction used by the rest of the application,
 * and the webhook structures received from Meta.
 */

// ---------------------------------------------------------------------------
// Outbound message types
// ---------------------------------------------------------------------------

export type WhatsAppMessageType = 'template' | 'text' | 'interactive';

export interface WhatsAppMessage {
  /** Recipient phone number in E.164 format (e.g. "+919876543210"). */
  to: string;
  messageType: WhatsAppMessageType;
  /** Template name when messageType is 'template'. */
  templateName?: string;
  /** Positional template parameters. */
  templateParams?: string[];
  /** Plain-text body when messageType is 'text'. */
  body?: string;
  /** Language code for template messages (default: "en"). */
  languageCode?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  /** WhatsApp-assigned message ID on success. */
  messageId?: string;
  /** Human-readable error description on failure. */
  error?: string;
}

// ---------------------------------------------------------------------------
// Webhook payload types (Cloud API v21.0 structure)
// ---------------------------------------------------------------------------

export interface WebhookContact {
  profile: { name: string };
  wa_id: string;
}

export interface WebhookMessageText {
  body: string;
}

export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: WebhookMessageText;
}

export interface WebhookStatusConversation {
  id: string;
  origin?: { type: string };
}

export interface WebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  conversation?: WebhookStatusConversation;
  errors?: Array<{ code: number; title: string }>;
}

export interface WebhookValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WebhookContact[];
  messages?: WebhookMessage[];
  statuses?: WebhookStatus[];
}

export interface WebhookChange {
  value: WebhookValue;
  field: string;
}

export interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: WebhookEntry[];
}

// ---------------------------------------------------------------------------
// Parsed webhook result (application-level)
// ---------------------------------------------------------------------------

export interface ParsedWebhookMessage {
  from: string;
  messageId: string;
  timestamp: string;
  type: string;
  text?: string;
  contactName?: string;
}

export interface ParsedWebhookStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipientId: string;
  errorCode?: number;
  errorTitle?: string;
}

export interface ParsedWebhookResult {
  messages: ParsedWebhookMessage[];
  statuses: ParsedWebhookStatus[];
}

// ---------------------------------------------------------------------------
// Provider interface
// ---------------------------------------------------------------------------

export interface WhatsAppProvider {
  /** Send an arbitrary message (text, template, or interactive). */
  sendMessage(msg: WhatsAppMessage): Promise<WhatsAppSendResult>;

  /** Convenience: send a pre-approved template with positional parameters. */
  sendTemplate(
    to: string,
    templateName: string,
    params: string[],
    languageCode?: string,
  ): Promise<WhatsAppSendResult>;

  /** Verify the HMAC-SHA256 signature on an incoming webhook request. */
  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    secret: string,
  ): boolean;

  /** Parse the raw Cloud API webhook JSON into an application-level result. */
  parseWebhookPayload(body: WhatsAppWebhookPayload): ParsedWebhookResult;
}

// ---------------------------------------------------------------------------
// Provider configuration
// ---------------------------------------------------------------------------

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  appSecret: string;
  /** Defaults to "v21.0". */
  apiVersion?: string;
}
