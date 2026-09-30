/**
 * WhatsApp webhook processing logic.
 *
 * Validates signatures, parses the payload, enforces idempotency,
 * and dispatches inbound messages and status updates to the
 * appropriate handlers.
 */

import type {
  WhatsAppWebhookPayload,
  ParsedWebhookMessage,
  ParsedWebhookStatus,
} from './types';
import { getWhatsAppProvider } from './provider';
import type { DeliveryStatus } from '@/domain/conversation';

// ---------------------------------------------------------------------------
// Idempotency store (in-memory for now; swap for Firestore in production)
// ---------------------------------------------------------------------------

const processedEvents = new Set<string>();

/**
 * Check whether a webhook event has already been processed.
 * Returns true if the key was already seen (i.e. this is a duplicate).
 */
export function isDuplicate(idempotencyKey: string): boolean {
  return processedEvents.has(idempotencyKey);
}

/**
 * Mark a webhook event as processed.
 */
export function markProcessed(idempotencyKey: string): void {
  processedEvents.add(idempotencyKey);
}

/**
 * Reset the in-memory store. Intended for tests only.
 * @internal
 */
export function _resetIdempotencyStore(): void {
  processedEvents.clear();
}

// ---------------------------------------------------------------------------
// Idempotency key derivation
// ---------------------------------------------------------------------------

/**
 * Derive a stable idempotency key from a webhook message or status.
 *
 * For messages the key is the WhatsApp message ID.
 * For statuses it combines the message ID and the status value
 * because the same message can pass through multiple statuses.
 */
export function deriveIdempotencyKey(
  item: ParsedWebhookMessage | ParsedWebhookStatus,
): string {
  if ('from' in item) {
    // It's a message.
    return `msg:${item.messageId}`;
  }
  // It's a status update.
  return `status:${item.messageId}:${item.status}`;
}

// ---------------------------------------------------------------------------
// Handler results
// ---------------------------------------------------------------------------

export interface WebhookProcessingResult {
  /** Number of new messages processed (excluding duplicates). */
  messagesProcessed: number;
  /** Number of new status updates processed (excluding duplicates). */
  statusesProcessed: number;
  /** Number of duplicate items skipped. */
  duplicatesSkipped: number;
  /** Non-fatal errors encountered during processing. */
  errors: string[];
}

// ---------------------------------------------------------------------------
// Message & status handlers
// ---------------------------------------------------------------------------

export interface InboundMessageRecord {
  from: string;
  messageId: string;
  timestamp: string;
  type: string;
  text?: string;
  contactName?: string;
}

export interface StatusUpdateRecord {
  messageId: string;
  status: DeliveryStatus;
  timestamp: string;
  recipientId: string;
  errorCode?: number;
  errorTitle?: string;
}

/**
 * Handle a single inbound message.
 *
 * In a full implementation this would:
 * 1. Look up or create a customer record using the phone number.
 * 2. Find or create a Conversation document.
 * 3. Append a Message document to the conversation.
 *
 * For now we return the normalized record for the caller to persist.
 */
export function handleInboundMessage(
  msg: ParsedWebhookMessage,
): InboundMessageRecord {
  return {
    from: msg.from,
    messageId: msg.messageId,
    timestamp: msg.timestamp,
    type: msg.type,
    text: msg.text,
    contactName: msg.contactName,
  };
}

/**
 * Handle a single delivery status update.
 *
 * Maps the WhatsApp status string to the domain DeliveryStatus
 * and returns a record for the caller to persist.
 */
export function handleStatusUpdate(
  status: ParsedWebhookStatus,
): StatusUpdateRecord {
  return {
    messageId: status.messageId,
    status: status.status as DeliveryStatus,
    timestamp: status.timestamp,
    recipientId: status.recipientId,
    errorCode: status.errorCode,
    errorTitle: status.errorTitle,
  };
}

// ---------------------------------------------------------------------------
// Main webhook processor
// ---------------------------------------------------------------------------

export interface ProcessWebhookOptions {
  rawBody: string;
  signature: string;
  appSecret: string;
}

/**
 * Process an incoming WhatsApp webhook.
 *
 * 1. Verify the signature.
 * 2. Parse the payload.
 * 3. For each message/status, check idempotency and dispatch.
 *
 * Returns a summary result. Throws on signature failure.
 */
export function processWebhook(
  payload: WhatsAppWebhookPayload,
  options: ProcessWebhookOptions,
): WebhookProcessingResult {
  const provider = getWhatsAppProvider();

  // 1. Verify signature
  const signatureValid = provider.verifyWebhookSignature(
    options.rawBody,
    options.signature,
    options.appSecret,
  );

  if (!signatureValid) {
    throw new Error('Invalid webhook signature');
  }

  // 2. Parse
  const parsed = provider.parseWebhookPayload(payload);

  // 3. Process
  const result: WebhookProcessingResult = {
    messagesProcessed: 0,
    statusesProcessed: 0,
    duplicatesSkipped: 0,
    errors: [],
  };

  for (const msg of parsed.messages) {
    const key = deriveIdempotencyKey(msg);
    if (isDuplicate(key)) {
      result.duplicatesSkipped += 1;
      continue;
    }
    try {
      handleInboundMessage(msg);
      markProcessed(key);
      result.messagesProcessed += 1;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Message ${msg.messageId}: ${errorMsg}`);
    }
  }

  for (const status of parsed.statuses) {
    const key = deriveIdempotencyKey(status);
    if (isDuplicate(key)) {
      result.duplicatesSkipped += 1;
      continue;
    }
    try {
      handleStatusUpdate(status);
      markProcessed(key);
      result.statusesProcessed += 1;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Status ${status.messageId}: ${errorMsg}`);
    }
  }

  return result;
}
