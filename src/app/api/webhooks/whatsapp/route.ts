/**
 * WhatsApp Cloud API webhook endpoint.
 *
 * GET  — Webhook verification (hub.mode / hub.verify_token / hub.challenge).
 * POST — Receive and process webhook events.
 *
 * The POST handler returns 200 immediately to avoid Meta's webhook
 * timeout. Processing happens synchronously but quickly since the
 * heavy persistence work is deferred to the handler layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processWebhook } from '@/integrations/whatsapp/webhook-handler';
import type { WhatsAppWebhookPayload } from '@/integrations/whatsapp/types';

// ---------------------------------------------------------------------------
// GET — Webhook verification
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error(
      '[WhatsApp Webhook] WHATSAPP_WEBHOOK_VERIFY_TOKEN is not configured.',
    );
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 },
    );
  }

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Webhook] Verification successful.');
    // Meta expects the challenge echoed as plain text with 200 status.
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.warn('[WhatsApp Webhook] Verification failed — token mismatch.');
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ---------------------------------------------------------------------------
// POST — Receive webhook events
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const appSecret = process.env.WHATSAPP_APP_SECRET ?? '';
  const signature = request.headers.get('x-hub-signature-256') ?? '';

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: 'Unable to read request body' },
      { status: 400 },
    );
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  try {
    const result = processWebhook(payload, {
      rawBody,
      signature,
      appSecret,
    });

    // Return 200 quickly regardless of processing outcome to prevent
    // Meta from retrying. Errors are logged and tracked internally.
    if (result.errors.length > 0) {
      console.warn(
        `[WhatsApp Webhook] Processed with ${result.errors.length} error(s):`,
        result.errors,
      );
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message === 'Invalid webhook signature') {
      console.warn('[WhatsApp Webhook] Invalid signature — rejecting.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    console.error('[WhatsApp Webhook] Unexpected error:', message);
    // Still return 200 to prevent infinite retries from Meta.
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}
