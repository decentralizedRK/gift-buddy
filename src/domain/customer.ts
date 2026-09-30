import { z } from 'zod';

export const AddressSchema = z.object({
  label: z.string(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});
export type Address = z.infer<typeof AddressSchema>;

export const CustomerSchema = z.object({
  id: z.string(),
  companyName: z.string().optional(),
  contactName: z.string().min(1),
  phone: z.string().min(1),
  normalizedPhone: z.string(),
  email: z.string().email().optional(),
  addresses: z.array(AddressSchema),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Customer = z.infer<typeof CustomerSchema>;

export function normalizePhone(phone: string): string {
  const stripped = phone.replace(/[\s\-().]/g, '');

  if (stripped.startsWith('+')) {
    return stripped;
  }

  if (stripped.startsWith('91') && stripped.length === 12) {
    return `+${stripped}`;
  }

  if (stripped.length === 10 && /^[6-9]/.test(stripped)) {
    return `+91${stripped}`;
  }

  return stripped;
}
