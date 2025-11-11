
import { MetadataRoute } from 'next';
import { newsSections, curiositaArticles } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mydatingame.com';

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
  ];

  const categoryUrls: MetadataRoute.Sitemap = newsSections.map((section) => ({
    url: `${baseUrl}/#${section.id}`,
    lastModified: new Date(),
    priority: 0.9,
  }));

  const curiositaUrl: MetadataRoute.Sitemap = [{
      url: `${baseUrl}/#curiosita`,
      lastModified: new Date(),
      priority: 0.9
  }]


  return [...staticUrls, ...categoryUrls, ...curiositaUrl];
}
