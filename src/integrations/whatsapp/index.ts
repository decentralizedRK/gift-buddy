/**
 * WhatsApp Business Platform integration — public API.
 */

// Types
export type {
  WhatsAppMessage,
  WhatsAppMessageType,
  WhatsAppSendResult,
  WhatsAppWebhookPayload,
  WhatsAppProvider,
  WhatsAppConfig,
  ParsedWebhookMessage,
  ParsedWebhookStatus,
  ParsedWebhookResult,
} from './types';

// Provider
export { getWhatsAppProvider, _resetProviderCache } from './provider';

// Adapters
export { fakeWhatsAppAdapter } from './fake-adapter';
export { createOfficialAdapter } from './official-adapter';

// Templates
export {
  TEMPLATE_MAPPINGS,
  getTemplateMapping,
  type TemplateMapping,
  type TransactionalEvent,
} from './templates';

// Webhook processing
export {
  processWebhook,
  handleInboundMessage,
  handleStatusUpdate,
  deriveIdempotencyKey,
  isDuplicate,
  markProcessed,
  _resetIdempotencyStore,
  type WebhookProcessingResult,
  type ProcessWebhookOptions,
  type InboundMessageRecord,
  type StatusUpdateRecord,
} from './webhook-handler';
