import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export default function SEOHead({
  title = 'Happinio | AI Destekli Kişiselleştirilmiş Hediye Kutuları',
  description = 'Yapay zeka ile saniyeler içinde kişiye özel hediye kutusu oluşturun. Doğal dille prompt yazın, sevdiklerinizi kişiselleştirilmiş hediyelerle mutlu edin.'
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Inject JSON-LD Schema Markup for E-Commerce & Gift Box Organization
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      'name': 'Happinio',
      'url': 'https://happinio.com',
      'description': description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://happinio.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      },
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Happinio Kişiselleştirilmiş Hediye Kutuları',
        'itemListElement': [
          {
            '@type': 'OfferCatalog',
            'name': 'Şehir Özel Hediye Kutuları'
          },
          {
            '@type': 'OfferCatalog',
            'name': 'Truva Şaka Kutuları'
          },
          {
            '@type': 'OfferCatalog',
            'name': 'B2B Kurumsal Onboarding Kutuları'
          },
          {
            '@type': 'OfferCatalog',
            'name': 'Yeni Anne & Bebek Kutuları'
          }
        ]
      }
    };

    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [title, description]);

  return null;
}
