/**
 * WhatsApp provider factory.
 *
 * Returns the appropriate adapter based on the WHATSAPP_ADAPTER
 * environment variable:
 *
 *   "official" — uses the real WhatsApp Cloud API (requires
 *                WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID,
 *                and WHATSAPP_APP_SECRET).
 *
 *   anything else (default) — uses the fake adapter that logs
 *                to the console without making real API calls.
 */

import type { WhatsAppProvider } from './types';
import { fakeWhatsAppAdapter } from './fake-adapter';
import { createOfficialAdapter } from './official-adapter';

let cachedProvider: WhatsAppProvider | null = null;

/**
 * Return a WhatsApp provider instance.
 *
 * The adapter choice is determined once per process lifetime
 * (based on `process.env.WHATSAPP_ADAPTER`). Subsequent calls
 * return the same instance.
 */
export function getWhatsAppProvider(): WhatsAppProvider {
  if (cachedProvider) return cachedProvider;

  const adapter = process.env.WHATSAPP_ADAPTER ?? 'fake';

  if (adapter === 'official') {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (!accessToken || !phoneNumberId || !appSecret) {
      throw new Error(
        'WHATSAPP_ADAPTER is "official" but one or more required environment ' +
          'variables are missing: WHATSAPP_ACCESS_TOKEN, ' +
          'WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_APP_SECRET.',
      );
    }

    cachedProvider = createOfficialAdapter({
      accessToken,
      phoneNumberId,
      appSecret,
    });
  } else {
    cachedProvider = fakeWhatsAppAdapter;
  }

  return cachedProvider;
}

/**
 * Reset the cached provider. Useful in tests.
 * @internal
 */
export function _resetProviderCache(): void {
  cachedProvider = null;
}
