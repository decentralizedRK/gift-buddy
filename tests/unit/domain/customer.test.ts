import { describe, it, expect } from 'vitest';
import { normalizePhone } from '@/domain/customer';

describe('normalizePhone', () => {
  it('adds +91 for 10-digit Indian numbers', () => {
    expect(normalizePhone('9876543210')).toBe('+919876543210');
    expect(normalizePhone('7012345678')).toBe('+917012345678');
  });

  it('handles numbers with spaces and dashes', () => {
    expect(normalizePhone('98765 43210')).toBe('+919876543210');
    expect(normalizePhone('987-654-3210')).toBe('+919876543210');
    expect(normalizePhone('98 7654 3210')).toBe('+919876543210');
    expect(normalizePhone('(987) 654-3210')).toBe('+919876543210');
  });

  it('preserves already-formatted international numbers', () => {
    expect(normalizePhone('+919876543210')).toBe('+919876543210');
    expect(normalizePhone('+14155551234')).toBe('+14155551234');
    expect(normalizePhone('+442071234567')).toBe('+442071234567');
  });

  it('handles 12-digit numbers starting with 91', () => {
    expect(normalizePhone('919876543210')).toBe('+919876543210');
  });

  it('does not add +91 to numbers that do not start with 6-9', () => {
    // 10-digit number starting with 5 should not get +91 prefix
    expect(normalizePhone('5123456789')).toBe('5123456789');
  });

  it('handles numbers with dots and parentheses', () => {
    expect(normalizePhone('987.654.3210')).toBe('+919876543210');
    expect(normalizePhone('(987)6543210')).toBe('+919876543210');
  });
});
