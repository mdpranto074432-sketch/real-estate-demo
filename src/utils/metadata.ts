import { useEffect } from 'react';
import { DEVELOPER_PROFILE, PROJECTS_DATA } from '../data/mockRealEstateData';

export interface PageMetadataProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMetaTag(
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string
) {
  let el = document.querySelector(
    `meta[${attributeName}="${attributeValue}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attributeName, attributeValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let link = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Updates document title, meta description, Open Graph, Twitter Cards,
 * Canonical URL, and Schema.org JSON-LD structured data dynamically per route.
 */
export function usePageMetadata({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage,
  structuredData,
}: PageMetadataProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${DEVELOPER_PROFILE.brandName} | Dhaka`;
    document.title = fullTitle;

    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://varendra.co';
    const path =
      canonicalPath ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonicalUrl = `${origin}${path}`;
    const imageUrl = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${origin}${ogImage}`
      : `${origin}${PROJECTS_DATA[0].heroImage}`;

    // Standard SEO Meta
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('name', 'robots', 'index, follow');
    upsertMetaTag('name', 'geo.region', 'BD-13');
    upsertMetaTag('name', 'geo.placename', 'Dhaka, Bangladesh');

    // Canonical URL
    upsertCanonicalLink(canonicalUrl);

    // OpenGraph Tags
    upsertMetaTag('property', 'og:type', ogType);
    upsertMetaTag('property', 'og:title', fullTitle);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:site_name', DEVELOPER_PROFILE.brandName);
    upsertMetaTag('property', 'og:locale', 'en_BD');
    upsertMetaTag('property', 'og:image', imageUrl);

    // Twitter / X Card Tags
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', fullTitle);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', imageUrl);

    // Dynamic JSON-LD Structured Data
    const scriptId = 'varendra-dynamic-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const baseOrgSchema = {
      '@context': 'https://schema.org',
      '@type': 'ArchitectureFirm',
      name: DEVELOPER_PROFILE.brandName,
      description: DEVELOPER_PROFILE.manifestoLead,
      url: origin,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Gulshan North Avenue (Concept Studio)',
        addressLocality: 'Dhaka',
        addressRegion: 'Dhaka Division',
        addressCountry: 'BD',
      },
      areaServed: [
        'Gulshan, Dhaka',
        'Baridhara Diplomatic Zone, Dhaka',
        'Banani, Dhaka',
        'Dhanmondi, Dhaka',
        'Bashundhara, Dhaka',
        'Jolshiri Abashon, Dhaka',
      ],
    };

    const payload = structuredData
      ? Array.isArray(structuredData)
        ? [baseOrgSchema, ...structuredData]
        : [baseOrgSchema, structuredData]
      : baseOrgSchema;

    scriptEl.textContent = JSON.stringify(payload);
  }, [title, description, canonicalPath, ogType, ogImage, structuredData]);
}
