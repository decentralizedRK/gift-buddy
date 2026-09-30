'use client';

import { APP_ENV } from '@/lib/env-config';

const bannerConfig = {
  'static-staging': {
    label: 'Static Staging — Demo Data',
    className: 'bg-amber-500 text-white',
  },
  staging: {
    label: 'Staging Environment',
    className: 'bg-blue-600 text-white',
  },
  production: null,
} as const;

export function EnvironmentBanner() {
  const config = bannerConfig[APP_ENV];
  if (!config) return null;

  return (
    <div className={`${config.className} text-center text-xs font-medium py-1 px-4`}>
      {config.label}
    </div>
  );
}
