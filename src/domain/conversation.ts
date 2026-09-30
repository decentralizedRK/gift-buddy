import { z } from 'zod';

export const ConversationChannelSchema = z.enum(['whatsapp', 'web']);
export type ConversationChannel = z.infer<typeof ConversationChannelSchema>;

export const ConversationStatusSchema = z.enum(['active', 'closed']);
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>;

export const ConversationSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerPhone: z.string(),
  relatedOrderId: z.string().optional(),
  channel: ConversationChannelSchema,
  status: ConversationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Conversation = z.infer<typeof ConversationSchema>;

export const MessageDirectionSchema = z.enum(['inbound', 'outbound']);
export type MessageDirection = z.infer<typeof MessageDirectionSchema>;

export const DeliveryStatusSchema = z.enum([
  'sent',
  'delivered',
  'read',
  'failed',
]);
export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  direction: MessageDirectionSchema,
  content: z.string(),
  templateName: z.string().optional(),
  templateParams: z.array(z.string()).optional(),
  whatsappMessageId: z.string().optional(),
  deliveryStatus: DeliveryStatusSchema.optional(),
  failureReason: z.string().optional(),
  timestamp: z.date(),
});
export type Message = z.infer<typeof MessageSchema>;

export const WebhookEventStatusSchema = z.enum([
  'pending',
  'processed',
  'failed',
  'duplicate',
]);
export type WebhookEventStatus = z.infer<typeof WebhookEventStatusSchema>;

export const WebhookEventSchema = z.object({
  id: z.string(),
  rawPayload: z.record(z.string(), z.unknown()),
  eventType: z.string(),
  processedAt: z.date().optional(),
  idempotencyKey: z.string(),
  status: WebhookEventStatusSchema,
});
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
