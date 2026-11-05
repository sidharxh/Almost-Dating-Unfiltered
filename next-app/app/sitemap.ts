import type {MetadataRoute} from 'next';
import {quizzes} from '@/content/quizzes';
import {siteUrl, contentUpdated} from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/quizzes', '/about', ...quizzes.map(quiz => `/quizzes/${quiz.slug}`)].map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: contentUpdated,
  }));
}
