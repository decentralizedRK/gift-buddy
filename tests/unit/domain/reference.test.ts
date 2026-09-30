import { describe, it, expect } from 'vitest';
import {
  generateReferenceNumber,
  generateIdempotencyKey,
} from '@/domain/reference';

describe('generateReferenceNumber', () => {
  it('returns a string in the format GB-XXXXXX', () => {
    const ref = generateReferenceNumber();
    expect(ref).toMatch(/^GB-[A-Z0-9]{6}$/);
  });

  it('does not contain ambiguous characters (0, O, 1, I, L)', () => {
    const ambiguous = ['0', 'O', '1', 'I', 'L'];
    // Generate multiple references to increase confidence
    for (let i = 0; i < 50; i++) {
      const ref = generateReferenceNumber();
      const body = ref.slice(3); // strip "GB-"
      for (const char of ambiguous) {
        expect(body).not.toContain(char);
      }
    }
  });

  it('returns unique values on multiple calls', () => {
    const refs = new Set<string>();
    for (let i = 0; i < 100; i++) {
      refs.add(generateReferenceNumber());
    }
    expect(refs.size).toBe(100);
  });
});

describe('generateIdempotencyKey', () => {
  it('returns a valid UUID v4 format', () => {
    const key = generateIdempotencyKey();
    expect(key).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('returns unique values on multiple calls', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 100; i++) {
      keys.add(generateIdempotencyKey());
    }
    expect(keys.size).toBe(100);
  });
});
