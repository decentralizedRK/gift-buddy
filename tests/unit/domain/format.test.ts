import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, truncate } from '@/lib/format';

describe('formatPrice', () => {
  it('formats paise to INR currency string', () => {
    const result = formatPrice(249900);
    // Intl.NumberFormat may use a non-breaking space or narrow no-break space
    expect(result).toContain('2,499.00');
    expect(result).toContain('₹'); // Rupee sign
  });

  it('formats zero correctly', () => {
    const result = formatPrice(0);
    expect(result).toContain('0.00');
  });

  it('formats small amounts correctly', () => {
    const result = formatPrice(100);
    expect(result).toContain('1.00');
  });

  it('formats large amounts with Indian grouping', () => {
    const result = formatPrice(1000000);
    // Indian format: 10,000.00 (not 1,000,0.00)
    expect(result).toContain('10,000.00');
  });
});

describe('formatDate', () => {
  it('formats a Date object correctly', () => {
    const date = new Date('2025-01-15T00:00:00Z');
    const result = formatDate(date);
    expect(result).toContain('Jan');
    expect(result).toContain('2025');
    expect(result).toContain('15');
  });

  it('formats a date string correctly', () => {
    const result = formatDate('2025-06-20T12:00:00Z');
    expect(result).toContain('Jun');
    expect(result).toContain('2025');
    expect(result).toContain('20');
  });
});

describe('truncate', () => {
  it('returns the original string if shorter than limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string if equal to limit', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates strings longer than the limit and adds ellipsis', () => {
    const result = truncate('hello world', 5);
    expect(result).toBe('hell…');
    expect(result.length).toBe(5);
  });

  it('handles empty strings', () => {
    expect(truncate('', 5)).toBe('');
  });
});
