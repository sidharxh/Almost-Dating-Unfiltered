import type { Metadata } from 'next';
import type { Quiz } from '@/content/quizzes';

export const siteUrl = 'https://almostunfiltereddating.com';
export const contentUpdated = '2026-11-05';
export const homeTitle = 'Free Dating Quizzes: Dating Style, Texting & First Dates';
export const homeDescription = 'Explore your dating style, texting habits, and first-date preferences with free 4–5 question quizzes. Sign in with Google for results and share cards.';

export function pageMetadata(title: string, description: string, path: string, image = '/opengraph-image'): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website', siteName: 'Almost', locale: 'en_US',
      title, description, url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function quizMetadata(quiz: Quiz): Metadata {
  return pageMetadata(quiz.seo.title, quiz.seo.description, `/quizzes/${quiz.slug}`, `/quizzes/${quiz.slug}/opengraph-image`);
}

export const websiteSchema = {
  '@type': 'WebSite', '@id': `${siteUrl}/#website`,
  name: 'Almost', alternateName: 'Almost Unfiltered Dating', url: siteUrl,
  description: homeDescription, inLanguage: 'en',
  publisher: { '@id': `${siteUrl}/#organization` },
};
export const organizationSchema = {
  '@type': 'Organization', '@id': `${siteUrl}/#organization`,
  name: 'Almost', url: siteUrl,
  logo: { '@type': 'ImageObject', url: `${siteUrl}/brand/almost-google-logo.png`, width:120, height:120 },
};
export function collectionSchema(quizzes: Quiz[], path: string, title: string, description: string) {
  return {
    '@type': 'CollectionPage', '@id': `${siteUrl}${path}#webpage`,
    url: `${siteUrl}${path}`, name: title, description,
    inLanguage: 'en', isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntity: {
      '@type': 'ItemList', numberOfItems: quizzes.length,
      itemListElement: quizzes.map((quiz, index) => ({
        '@type': 'ListItem', position: index + 1,
        name: quiz.title, url: `${siteUrl}/quizzes/${quiz.slug}`,
      })),
    },
  };
}
export function quizSchema(quiz: Quiz) {
  const url = `${siteUrl}/quizzes/${quiz.slug}`;
  return {
    '@type': 'Quiz', '@id': `${url}#quiz`, url,
    name: quiz.title, description: quiz.intro,
    abstract: quiz.researchNote, inLanguage: 'en',
    version: quiz.version, dateModified: contentUpdated,
    isAccessibleForFree: true, learningResourceType: 'Self-reflection quiz',
    about: quiz.seo.keywords,
    image: `${url}/opengraph-image`,
    publisher: { '@id': `${siteUrl}/#organization` },
    isPartOf: { '@id': `${siteUrl}/#website` },
    citation: quiz.sources.map(source => source.url),
  };
}
