
import { MetadataRoute } from 'next';
import { newsSections } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mydatingame.com';

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(), // Dynamic date for the homepage
      priority: 1.0,
    },
     {
      url: `${baseUrl}/#join-creators`, // Anchor link for submit content
      lastModified: '2025-11-11',
      priority: 0.8,
    }
  ];

  // Dynamically create URLs for all news sections
  const categoryUrls: MetadataRoute.Sitemap = newsSections.map((section) => ({
    url: `${baseUrl}/#${section.id}`,
    lastModified: '2025-11-11', // Using a static date for now
    priority: 0.9,
  }));
  
  const curiositaUrl: MetadataRoute.Sitemap = [{
      url: `${baseUrl}/#curiosita`,
      lastModified: '2025-11-11',
      priority: 0.9
  }];


  return [...staticUrls, ...categoryUrls, ...curiositaUrl];
}
