export type AppEnv = 'static-staging' | 'staging' | 'production';

const raw = process.env.NEXT_PUBLIC_APP_ENV ?? 'static-staging';

function parseAppEnv(value: string): AppEnv {
  if (value === 'staging' || value === 'production') return value;
  return 'static-staging';
}

export const APP_ENV: AppEnv = parseAppEnv(raw);
export const isStaticStaging = APP_ENV === 'static-staging';
export const isFirestoreEnabled = APP_ENV === 'staging' || APP_ENV === 'production';
export const isProduction = APP_ENV === 'production';
