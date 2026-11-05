import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/analytics';
import StructuredData from '@/components/structured-data';
import {siteUrl, homeTitle, homeDescription, websiteSchema, organizationSchema} from '@/lib/seo';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Almost',
  title: {default: homeTitle + ' | Almost', template: '%s | Almost'},
  description: homeDescription,
  robots: {index: true, follow: true, googleBot: {index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1}},
};
export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en"><body><StructuredData data={{'@context': 'https://schema.org', '@graph': [organizationSchema, websiteSchema]}}/>{children}<Analytics /></body></html>;
}
