import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'inquiry_received',
  'qualification_pending',
  'quote_preparing',
  'quote_sent',
  'customer_approved',
  'confirmed',
  'procurement',
  'packing',
  'ready_to_dispatch',
  'dispatched',
  'delivered',
  'cancelled',
  'rejected',
  'on_hold',
  'delivery_failed',
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  inquiry_received: ['qualification_pending', 'cancelled', 'rejected'],
  qualification_pending: ['quote_preparing', 'cancelled', 'rejected', 'on_hold'],
  quote_preparing: ['quote_sent', 'cancelled', 'on_hold'],
  quote_sent: ['customer_approved', 'cancelled', 'rejected', 'on_hold'],
  customer_approved: ['confirmed', 'cancelled'],
  confirmed: ['procurement', 'cancelled', 'on_hold'],
  procurement: ['packing', 'cancelled', 'on_hold'],
  packing: ['ready_to_dispatch', 'on_hold'],
  ready_to_dispatch: ['dispatched', 'on_hold'],
  dispatched: ['delivered', 'delivery_failed'],
  delivered: [],
  cancelled: [],
  rejected: [],
  on_hold: [
    'qualification_pending',
    'quote_preparing',
    'quote_sent',
    'confirmed',
    'procurement',
    'packing',
    'ready_to_dispatch',
    'cancelled',
  ],
  delivery_failed: ['ready_to_dispatch', 'cancelled'],
};

export function validateTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  return VALID_TRANSITIONS[currentStatus].includes(newStatus);
}

export const OrderItemSchema = z.object({
  productId: z.string(),
  productTitle: z.string(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().int().min(0),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  status: OrderStatusSchema,
  items: z.array(OrderItemSchema),
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  quantity: z.number().int().min(1),
  requestedDate: z.string().optional(),
  deliveryMode: z.string().optional(),
  addresses: z.array(z.string()),
  personalizationNotes: z.string().optional(),
  budget: z.number().int().min(0).optional(),
  subtotal: z.number().int().min(0),
  currency: z.literal('INR'),
  consentGiven: z.boolean(),
  idempotencyKey: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Order = z.infer<typeof OrderSchema>;

export const OrderEventSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  previousStatus: OrderStatusSchema,
  newStatus: OrderStatusSchema,
  actor: z.string(),
  source: z.string(),
  note: z.string().optional(),
  timestamp: z.date(),
});
export type OrderEvent = z.infer<typeof OrderEventSchema>;
