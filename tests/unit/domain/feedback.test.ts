import { describe, it, expect } from 'vitest';
import {
  FEEDBACK_TYPES,
  FeedbackTypeSchema,
  FeedbackStatusSchema,
  VALID_FEEDBACK_TRANSITIONS,
  validateFeedbackTransition,
  FeedbackPrioritySchema,
  FeedbackCategorySchema,
  SentimentSchema,
  PublicFeedbackFormSchema,
  sanitizeCsvValue,
} from '@/domain/feedback';
import type { FeedbackStatus } from '@/domain/feedback';

// --- Feedback Type Validation ---

describe('Feedback type validation', () => {
  const allTypes = [
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
  ] as const;

  it('all 12 feedback types are valid', () => {
    for (const type of allTypes) {
      expect(FeedbackTypeSchema.safeParse(type).success).toBe(true);
    }
    expect(allTypes.length).toBe(12);
  });

  it('rejects an invalid feedback type', () => {
    expect(FeedbackTypeSchema.safeParse('invalid_type').success).toBe(false);
    expect(FeedbackTypeSchema.safeParse('').success).toBe(false);
    expect(FeedbackTypeSchema.safeParse(42).success).toBe(false);
  });

  it('FEEDBACK_TYPES keys match FeedbackTypeSchema values', () => {
    const keys = Object.keys(FEEDBACK_TYPES);
    for (const key of keys) {
      expect(FeedbackTypeSchema.safeParse(key).success).toBe(true);
    }
    // Also verify count matches
    expect(keys.length).toBe(12);
  });
});

// --- Status Transitions ---

describe('Status transitions', () => {
  it('all valid transitions in VALID_FEEDBACK_TRANSITIONS are accepted', () => {
    for (const [current, nextStates] of Object.entries(VALID_FEEDBACK_TRANSITIONS)) {
      for (const next of nextStates) {
        expect(
          validateFeedbackTransition(current as FeedbackStatus, next)
        ).toBe(true);
      }
    }
  });

  it('rejects invalid transition: spam -> under_review', () => {
    expect(validateFeedbackTransition('spam', 'under_review')).toBe(false);
  });

  it('rejects invalid transition: closed -> spam', () => {
    expect(validateFeedbackTransition('closed', 'spam')).toBe(false);
  });

  it('terminal state spam has no valid transitions', () => {
    expect(VALID_FEEDBACK_TRANSITIONS['spam']).toEqual([]);
    // Verify spam cannot go to any status
    const allStatuses = FeedbackStatusSchema.options;
    for (const status of allStatuses) {
      expect(validateFeedbackTransition('spam', status)).toBe(false);
    }
  });

  it('reopening: closed -> under_review is valid', () => {
    expect(validateFeedbackTransition('closed', 'under_review')).toBe(true);
  });

  it('duplicate -> under_review is valid', () => {
    expect(validateFeedbackTransition('duplicate', 'under_review')).toBe(true);
  });

  it('rejects transitions not in the map (e.g. new -> implemented)', () => {
    expect(validateFeedbackTransition('new', 'implemented')).toBe(false);
  });

  it('rejects self-transition (e.g. new -> new)', () => {
    expect(validateFeedbackTransition('new', 'new')).toBe(false);
  });
});

// --- Rating Validation ---

describe('Rating validation', () => {
  it('ratings 1 through 5 are valid', () => {
    for (let r = 1; r <= 5; r++) {
      const result = PublicFeedbackFormSchema.safeParse(validFormData({ rating: r }));
      expect(result.success).toBe(true);
    }
  });

  it('rating 0 is invalid', () => {
    const result = PublicFeedbackFormSchema.safeParse(validFormData({ rating: 0 }));
    expect(result.success).toBe(false);
  });

  it('rating 6 is invalid', () => {
    const result = PublicFeedbackFormSchema.safeParse(validFormData({ rating: 6 }));
    expect(result.success).toBe(false);
  });

  it('rating can be undefined (optional)', () => {
    const data = validFormData({});
    delete (data as Record<string, unknown>).rating;
    const result = PublicFeedbackFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('non-integer rating is invalid', () => {
    const result = PublicFeedbackFormSchema.safeParse(validFormData({ rating: 3.5 }));
    expect(result.success).toBe(false);
  });
});

// --- Anonymous Submission Behavior ---

describe('Anonymous submission behavior', () => {
  it('anonymous=true with no contact info is valid', () => {
    const result = PublicFeedbackFormSchema.safeParse(
      validFormData({ contactRequested: false, consent: false })
    );
    expect(result.success).toBe(true);
  });

  it('contactRequested=true requires consent=true AND (email or phone)', () => {
    const result = PublicFeedbackFormSchema.safeParse(
      validFormData({
        contactRequested: true,
        consent: true,
        email: 'test@example.com',
      })
    );
    expect(result.success).toBe(true);
  });

  it('contactRequested=true with consent=false fails validation', () => {
    const result = PublicFeedbackFormSchema.safeParse(
      validFormData({
        contactRequested: true,
        consent: false,
        email: 'test@example.com',
      })
    );
    expect(result.success).toBe(false);
  });

  it('contactRequested=true with consent=true but no email/phone fails', () => {
    const data = validFormData({
      contactRequested: true,
      consent: true,
    });
    delete (data as Record<string, unknown>).email;
    delete (data as Record<string, unknown>).phone;
    const result = PublicFeedbackFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('contactRequested=false allows empty contact fields', () => {
    const data = validFormData({ contactRequested: false, consent: false });
    delete (data as Record<string, unknown>).email;
    delete (data as Record<string, unknown>).phone;
    const result = PublicFeedbackFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

// --- Consent / Honeypot Logic ---

describe('Consent and honeypot logic', () => {
  it('PublicFeedbackFormSchema: contactRequested=true needs consent + contact info', () => {
    // With phone instead of email
    const withPhone = PublicFeedbackFormSchema.safeParse(
      validFormData({
        contactRequested: true,
        consent: true,
        phone: '+919876543210',
      })
    );
    expect(withPhone.success).toBe(true);
  });

  it('honeypot field rejects non-empty values', () => {
    const result = PublicFeedbackFormSchema.safeParse(
      validFormData({ honeypot: 'bot-filled' })
    );
    expect(result.success).toBe(false);
  });

  it('honeypot field accepts empty string', () => {
    const result = PublicFeedbackFormSchema.safeParse(
      validFormData({ honeypot: '' })
    );
    expect(result.success).toBe(true);
  });

  it('honeypot field accepts undefined', () => {
    const data = validFormData({});
    delete (data as Record<string, unknown>).honeypot;
    const result = PublicFeedbackFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

// --- Priority and Category Validation ---

describe('Priority validation', () => {
  it('all priority values are valid', () => {
    const priorities = ['low', 'normal', 'high', 'urgent'];
    for (const p of priorities) {
      expect(FeedbackPrioritySchema.safeParse(p).success).toBe(true);
    }
  });

  it('rejects invalid priority', () => {
    expect(FeedbackPrioritySchema.safeParse('critical').success).toBe(false);
    expect(FeedbackPrioritySchema.safeParse('').success).toBe(false);
  });
});

describe('Category validation', () => {
  it('all category values are valid', () => {
    const categories = [
      'product', 'packaging', 'website', 'order_process', 'delivery',
      'pricing', 'personalization', 'catalog_gap', 'corporate_service', 'other',
    ];
    for (const c of categories) {
      expect(FeedbackCategorySchema.safeParse(c).success).toBe(true);
    }
  });

  it('rejects invalid category', () => {
    expect(FeedbackCategorySchema.safeParse('invalid').success).toBe(false);
  });
});

// --- Sentiment Validation ---

describe('Sentiment validation', () => {
  it('all 5 sentiment values are valid', () => {
    const sentiments = ['positive', 'neutral', 'negative', 'mixed', 'not_classified'];
    for (const s of sentiments) {
      expect(SentimentSchema.safeParse(s).success).toBe(true);
    }
    expect(sentiments.length).toBe(5);
  });

  it('rejects invalid sentiment', () => {
    expect(SentimentSchema.safeParse('angry').success).toBe(false);
  });
});

// --- CSV Safety ---

describe('sanitizeCsvValue', () => {
  it('prefixes = with single quote', () => {
    expect(sanitizeCsvValue('=SUM(A1)')).toBe("'=SUM(A1)");
  });

  it('prefixes + with single quote', () => {
    expect(sanitizeCsvValue('+1234')).toBe("'+1234");
  });

  it('prefixes - with single quote', () => {
    expect(sanitizeCsvValue('-value')).toBe("'-value");
  });

  it('prefixes @ with single quote', () => {
    expect(sanitizeCsvValue('@import')).toBe("'@import");
  });

  it('leaves normal text unchanged', () => {
    expect(sanitizeCsvValue('Hello World')).toBe('Hello World');
    expect(sanitizeCsvValue('regular data 123')).toBe('regular data 123');
  });

  it('handles empty string', () => {
    expect(sanitizeCsvValue('')).toBe('');
  });
});

// --- Helper ---

function validFormData(overrides: Record<string, unknown> = {}) {
  return {
    type: 'general_feedback',
    category: 'other',
    title: 'Test Feedback',
    message: 'This is a test feedback message.',
    rating: 4,
    contactRequested: false,
    consent: false,
    honeypot: '',
    ...overrides,
  };
}
