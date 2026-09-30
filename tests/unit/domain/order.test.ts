import { describe, it, expect } from 'vitest';
import {
  validateTransition,
  VALID_TRANSITIONS,
  type OrderStatus,
} from '@/domain/order';

describe('validateTransition', () => {
  it('allows valid transitions', () => {
    expect(validateTransition('inquiry_received', 'qualification_pending')).toBe(true);
    expect(validateTransition('qualification_pending', 'quote_preparing')).toBe(true);
    expect(validateTransition('quote_preparing', 'quote_sent')).toBe(true);
    expect(validateTransition('confirmed', 'procurement')).toBe(true);
    expect(validateTransition('dispatched', 'delivered')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(validateTransition('inquiry_received', 'delivered')).toBe(false);
    expect(validateTransition('quote_preparing', 'delivered')).toBe(false);
    expect(validateTransition('packing', 'inquiry_received')).toBe(false);
  });

  it('validates inquiry_received -> qualification_pending is valid', () => {
    expect(validateTransition('inquiry_received', 'qualification_pending')).toBe(true);
  });

  it('rejects confirmed -> inquiry_received (no backward transition)', () => {
    expect(validateTransition('confirmed', 'inquiry_received')).toBe(false);
  });

  it('ensures all terminal states have no valid transitions', () => {
    const terminalStates: OrderStatus[] = ['delivered', 'cancelled', 'rejected'];
    for (const state of terminalStates) {
      expect(VALID_TRANSITIONS[state]).toEqual([]);
      // Verify validateTransition returns false for any target
      const allStatuses = Object.keys(VALID_TRANSITIONS) as OrderStatus[];
      for (const target of allStatuses) {
        expect(validateTransition(state, target)).toBe(false);
      }
    }
  });

  it('allows cancellation from most active states', () => {
    const cancellableStates: OrderStatus[] = [
      'inquiry_received',
      'qualification_pending',
      'quote_preparing',
      'quote_sent',
      'customer_approved',
      'confirmed',
      'procurement',
    ];
    for (const state of cancellableStates) {
      expect(validateTransition(state, 'cancelled')).toBe(true);
    }
  });

  it('allows on_hold to resume to multiple states', () => {
    const resumeTargets: OrderStatus[] = [
      'qualification_pending',
      'quote_preparing',
      'quote_sent',
      'confirmed',
      'procurement',
      'packing',
      'ready_to_dispatch',
      'cancelled',
    ];
    for (const target of resumeTargets) {
      expect(validateTransition('on_hold', target)).toBe(true);
    }
  });
});
