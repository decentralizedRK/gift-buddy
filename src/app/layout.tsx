import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { EnvironmentBanner } from '@/components/EnvironmentBanner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gift Buddy — Premium Corporate Gifting',
    template: '%s | Gift Buddy',
  },
  description:
    'Curated corporate gift hampers for every occasion. Sustainable, premium, and personalized gifting solutions for businesses.',
  keywords: [
    'corporate gifts',
    'gift hampers',
    'business gifts',
    'employee gifts',
    'festival hampers',
    'bulk gifting',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <EnvironmentBanner />
        {children}
      </body>
    </html>
  );
}
