
import { MetadataRoute } from 'next';
import { newsSections } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mydatingame.com';

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
     {
      url: `${baseUrl}/#join-creators`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/likeflow/upload`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/likeflow/feed`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/likeflow/top`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/likeflow/purchase`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2025-11-11',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: '2025-11-11',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2025-11-11',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: '2025-11-11',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: '2025-11-11',
      priority: 0.5,
    },
     {
      url: `${baseUrl}/library`,
      lastModified: '2025-11-11',
      priority: 0.8,
    },
  ];

  const categoryUrls: MetadataRoute.Sitemap = newsSections.map((section) => ({
    url: `${baseUrl}/#${section.id}`,
    lastModified: '2025-11-11',
    priority: 0.9,
  }));
  
  const curiositaUrl: MetadataRoute.Sitemap = [{
      url: `${baseUrl}/#curiosita`,
      lastModified: '2025-11-11',
      priority: 0.9
  }];


  return [...staticUrls, ...categoryUrls, ...curiositaUrl];
}

    