import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

const REFERENCE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const REFERENCE_LENGTH = 6;

const generateId = customAlphabet(REFERENCE_ALPHABET, REFERENCE_LENGTH);

export function generateReferenceNumber(): string {
  return `GB-${generateId()}`;
}

export function generateIdempotencyKey(): string {
  return uuidv4();
}
