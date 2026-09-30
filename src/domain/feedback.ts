import { z } from 'zod';

// --- Feedback Types (centrally defined) ---

export const FEEDBACK_TYPES = {
  hamper_suggestion: 'Gift Hamper Suggestion',
  hamper_improvement: 'Existing Hamper Improvement',
  product_feedback: 'Product Feedback',
  website_feedback: 'Website Feedback',
  ordering_experience: 'Ordering Experience',
  delivery_feedback: 'Delivery Feedback',
  packaging_feedback: 'Packaging Feedback',
  pricing_feedback: 'Pricing Feedback',
  corporate_service: 'Corporate Service Feedback',
  recommendation_request: 'Recommendation Request',
  general_feedback: 'General Feedback',
  other: 'Other',
} as const;

export const FeedbackTypeSchema = z.enum([
  'hamper_suggestion',
  'hamper_improvement',
  'product_feedback',
  'website_feedback',
  'ordering_experience',
  'delivery_feedback',
  'packaging_feedback',
  'pricing_feedback',
  'corporate_service',
  'recommendation_request',
  'general_feedback',
  'other',
]);
export type FeedbackType = z.infer<typeof FeedbackTypeSchema>;

// --- Status Lifecycle ---

export const FeedbackStatusSchema = z.enum([
  'new',
  'triaged',
  'under_review',
  'planned',
  'accepted',
  'implemented',
  'responded',
  'closed',
  'duplicate',
  'rejected',
  'spam',
]);
export type FeedbackStatus = z.infer<typeof FeedbackStatusSchema>;

export const VALID_FEEDBACK_TRANSITIONS: Record<FeedbackStatus, FeedbackStatus[]> = {
  new: ['triaged', 'under_review', 'duplicate', 'spam', 'rejected', 'closed'],
  triaged: ['under_review', 'planned', 'accepted', 'responded', 'duplicate', 'rejected', 'closed'],
  under_review: ['planned', 'accepted', 'responded', 'duplicate', 'rejected', 'closed'],
  planned: ['accepted', 'implemented', 'rejected', 'closed'],
  accepted: ['implemented', 'closed'],
  implemented: ['closed'],
  responded: ['closed', 'under_review'],
  closed: ['under_review'],
  duplicate: ['under_review'],
  rejected: ['under_review'],
  spam: [],
};

export function validateFeedbackTransition(
  current: FeedbackStatus,
  next: FeedbackStatus
): boolean {
  return VALID_FEEDBACK_TRANSITIONS[current].includes(next);
}

// --- Priority ---

export const FeedbackPrioritySchema = z.enum(['low', 'normal', 'high', 'urgent']);
export type FeedbackPriority = z.infer<typeof FeedbackPrioritySchema>;

// --- Category ---

export const FeedbackCategorySchema = z.enum([
  'product',
  'packaging',
  'website',
  'order_process',
  'delivery',
  'pricing',
  'personalization',
  'catalog_gap',
  'corporate_service',
  'other',
]);
export type FeedbackCategory = z.infer<typeof FeedbackCategorySchema>;

// --- Sentiment (owner-classified only) ---

export const SentimentSchema = z.enum([
  'positive',
  'neutral',
  'negative',
  'mixed',
  'not_classified',
]);
export type Sentiment = z.infer<typeof SentimentSchema>;

// --- Budget Range ---

export const BudgetRangeSchema = z.enum([
  'under_1000',
  '1000_2500',
  '2500_5000',
  '5000_10000',
  'above_10000',
]);
export type BudgetRange = z.infer<typeof BudgetRangeSchema>;

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  under_1000: 'Under ₹1,000',
  '1000_2500': '₹1,000 – ₹2,500',
  '2500_5000': '₹2,500 – ₹5,000',
  '5000_10000': '₹5,000 – ₹10,000',
  above_10000: 'Above ₹10,000',
};

// --- Quantity Range ---

export const QuantityRangeSchema = z.enum([
  '1_10',
  '10_25',
  '25_50',
  '50_100',
  '100_500',
  'above_500',
]);
export type QuantityRange = z.infer<typeof QuantityRangeSchema>;

export const QUANTITY_RANGE_LABELS: Record<QuantityRange, string> = {
  '1_10': '1 – 10',
  '10_25': '10 – 25',
  '25_50': '25 – 50',
  '50_100': '50 – 100',
  '100_500': '100 – 500',
  above_500: '500+',
};

// --- Product Snapshot ---

export const ProductSnapshotSchema = z.object({
  id: z.string(),
  sku: z.string(),
  title: z.string(),
  slug: z.string(),
});
export type ProductSnapshot = z.infer<typeof ProductSnapshotSchema>;

// --- Feedback Submission ---

export const FeedbackSubmissionSchema = z.object({
  id: z.string(),
  publicReference: z.string(),
  type: FeedbackTypeSchema,
  category: FeedbackCategorySchema,
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  rating: z.number().int().min(1).max(5).optional(),
  relatedProductId: z.string().optional(),
  relatedProductSnapshot: ProductSnapshotSchema.optional(),
  suggestedItems: z.array(z.string().max(200)).max(20).optional(),
  occasion: z.string().max(100).optional(),
  budgetRange: BudgetRangeSchema.optional(),
  quantityRange: QuantityRangeSchema.optional(),
  companyName: z.string().max(200).optional(),
  contactName: z.string().max(200).optional(),
  email: z.string().email().max(320).optional(),
  phone: z.string().max(20).optional(),
  anonymous: z.boolean(),
  contactRequested: z.boolean(),
  consent: z.boolean(),
  status: FeedbackStatusSchema,
  priority: FeedbackPrioritySchema,
  sentiment: SentimentSchema,
  tags: z.array(z.string().max(50)).max(10),
  duplicateOf: z.string().optional(),
  source: z.string(),
  idempotencyKeyHash: z.string(),
  isDemoData: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().optional(),
  assignedTo: z.string().optional(),
  retentionClass: z.string().optional(),
});
export type FeedbackSubmission = z.infer<typeof FeedbackSubmissionSchema>;

// --- Feedback Event (immutable audit trail) ---

export const FeedbackEventSchema = z.object({
  id: z.string(),
  feedbackId: z.string(),
  previousStatus: FeedbackStatusSchema,
  newStatus: FeedbackStatusSchema,
  actor: z.string(),
  source: z.string(),
  reason: z.string().optional(),
  internalNote: z.string().optional(),
  timestamp: z.date(),
});
export type FeedbackEvent = z.infer<typeof FeedbackEventSchema>;

// --- Public Feedback Form (subset for validation) ---

export const PublicFeedbackFormSchema = z
  .object({
    type: FeedbackTypeSchema,
    category: FeedbackCategorySchema,
    title: z.string().min(1, 'Title is required').max(200),
    message: z.string().min(1, 'Please provide your feedback').max(5000),
    rating: z.number().int().min(1).max(5).optional(),
    relatedProductId: z.string().optional(),
    suggestedItems: z.array(z.string().max(200)).max(20).optional(),
    occasion: z.string().max(100).optional(),
    budgetRange: BudgetRangeSchema.optional(),
    quantityRange: QuantityRangeSchema.optional(),
    companyName: z.string().max(200).optional(),
    contactName: z.string().max(200).optional(),
    email: z.string().email('Please enter a valid email').max(320).optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    contactRequested: z.boolean(),
    consent: z.boolean(),
    honeypot: z.string().max(0).optional(),
  })
  .refine(
    (data) => {
      if (data.contactRequested) {
        return !!data.consent && (!!data.email || !!data.phone);
      }
      return true;
    },
    {
      message: 'Contact details and consent are required when requesting a response',
      path: ['consent'],
    }
  );
export type PublicFeedbackForm = z.infer<typeof PublicFeedbackFormSchema>;

// --- Recommendation Request ---

export const RecommendationRequestSchema = z.object({
  id: z.string(),
  publicReference: z.string(),
  occasion: z.string().min(1).max(100),
  recipientGroup: z.string().min(1).max(200),
  numberOfRecipients: z.number().int().min(1),
  budgetPerRecipient: BudgetRangeSchema,
  totalBudgetApprox: z.string().max(100).optional(),
  requiredDate: z.string().max(50).optional(),
  deliveryCityOrRegion: z.string().max(200).optional(),
  dietaryPreferences: z.array(z.string().max(100)).max(10).optional(),
  sustainabilityPreference: z.boolean().optional(),
  personalizationRequired: z.boolean().optional(),
  brandingRequired: z.boolean().optional(),
  preferredCategories: z.array(z.string().max(100)).max(10).optional(),
  productsToAvoid: z.string().max(1000).optional(),
  additionalNotes: z.string().max(2000).optional(),
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(20).optional(),
  consent: z.boolean(),
  status: FeedbackStatusSchema,
  priority: FeedbackPrioritySchema,
  matchedProductIds: z.array(z.string()).optional(),
  source: z.string(),
  idempotencyKeyHash: z.string(),
  isDemoData: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  assignedTo: z.string().optional(),
});
export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;

// --- Public Recommendation Form ---

export const PublicRecommendationFormSchema = z.object({
  occasion: z.string().min(1, 'Please select an occasion').max(100),
  recipientGroup: z.string().min(1, 'Please describe the recipient group').max(200),
  numberOfRecipients: z.number().int().min(1, 'At least 1 recipient required'),
  budgetPerRecipient: BudgetRangeSchema,
  totalBudgetApprox: z.string().max(100).optional(),
  requiredDate: z.string().max(50).optional(),
  deliveryCityOrRegion: z.string().max(200).optional(),
  dietaryPreferences: z.array(z.string().max(100)).max(10).optional(),
  sustainabilityPreference: z.boolean().optional(),
  personalizationRequired: z.boolean().optional(),
  brandingRequired: z.boolean().optional(),
  preferredCategories: z.array(z.string().max(100)).max(10).optional(),
  productsToAvoid: z.string().max(1000).optional(),
  additionalNotes: z.string().max(2000).optional(),
  companyName: z.string().min(1, 'Company name is required').max(200),
  contactName: z.string().min(1, 'Contact name is required').max(200),
  email: z.string().email('Please enter a valid email').max(320),
  phone: z.string().max(20).optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'Consent is required' }),
  honeypot: z.string().max(0).optional(),
});
export type PublicRecommendationForm = z.infer<typeof PublicRecommendationFormSchema>;

// --- Gift Matching (rule-based) ---

export interface GiftMatchCriteria {
  occasion?: string;
  budgetRange?: BudgetRange;
  categories?: string[];
  sustainabilityPreference?: boolean;
  recipientGroup?: string;
}

export interface GiftMatchResult {
  productId: string;
  productTitle: string;
  productSlug: string;
  basePrice: number;
  matchReasons: string[];
  matchScore: number;
}

// --- CSV Export safety ---

export function sanitizeCsvValue(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
}
