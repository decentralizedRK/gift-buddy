/**
 * WhatsApp message template mappings for transactional events.
 *
 * Each entry maps a business event to a pre-approved template name
 * and a function that extracts the positional parameters from order
 * data. Template names are placeholders — replace them with the
 * actual approved template names from your WhatsApp Business Account
 * once they are available.
 */

import type { Order } from '@/domain/order';

// ---------------------------------------------------------------------------
// Template descriptor
// ---------------------------------------------------------------------------

export interface TemplateMapping {
  /** The approved WhatsApp template name. */
  templateName: string;
  /** Extract positional string parameters from an order. */
  paramExtractor: (order: Order) => string[];
  /** Default language code. */
  languageCode: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(paise: number): string {
  const rupees = (paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `INR ${rupees}`;
}

// ---------------------------------------------------------------------------
// Transactional event templates
// ---------------------------------------------------------------------------

export type TransactionalEvent =
  | 'inquiry_received'
  | 'quote_ready'
  | 'quote_accepted'
  | 'order_confirmed'
  | 'packing_started'
  | 'dispatched'
  | 'delivered'
  | 'delay_notice'
  | 'cancellation';

export const TEMPLATE_MAPPINGS: Record<TransactionalEvent, TemplateMapping> = {
  inquiry_received: {
    templateName: 'gift_buddy_inquiry_received',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
      order.companyName,
    ],
  },

  quote_ready: {
    templateName: 'gift_buddy_quote_ready',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
      formatCurrency(order.subtotal),
    ],
  },

  quote_accepted: {
    templateName: 'gift_buddy_quote_accepted',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
    ],
  },

  order_confirmed: {
    templateName: 'gift_buddy_order_confirmed',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
      formatCurrency(order.subtotal),
      String(order.quantity),
    ],
  },

  packing_started: {
    templateName: 'gift_buddy_packing_started',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
    ],
  },

  dispatched: {
    templateName: 'gift_buddy_dispatched',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
      // Tracking details would be passed as a note; use reference as fallback.
      order.referenceNumber,
    ],
  },

  delivered: {
    templateName: 'gift_buddy_delivered',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
    ],
  },

  delay_notice: {
    templateName: 'gift_buddy_delay_notice',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
    ],
  },

  cancellation: {
    templateName: 'gift_buddy_cancellation',
    languageCode: 'en',
    paramExtractor: (order) => [
      order.contactName,
      order.referenceNumber,
    ],
  },
};

/**
 * Look up the template mapping for a transactional event.
 * Returns undefined if the event name is not recognized.
 */
export function getTemplateMapping(
  event: string,
): TemplateMapping | undefined {
  return TEMPLATE_MAPPINGS[event as TransactionalEvent];
}
