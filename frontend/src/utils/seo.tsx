import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  schema?: object;
}

export const useSEO = ({ title, description, keywords, schema }: SEOProps) => {
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${siteUrl}${location.pathname}`);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `${siteUrl}${location.pathname}`);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', `${siteUrl}${location.pathname}`);

    // Add or update Schema.org JSON-LD
    if (schema) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }

    // Cleanup function
    return () => {
      const scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [title, description, keywords, schema, location.pathname, siteUrl]);
};

export const generateWebPageSchema = (title: string, description: string, url: string) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `${siteUrl}${url}`,
    publisher: {
      '@type': 'Organization',
      name: 'Sentinel Data Ship',
      logo: {
        '@type': 'ImageObject',
        url: 'https://static.readdy.ai/image/5da477fdae7b1d111ee386eccbf37db2/732a02039d321f0d322d28065ca5f71b.png'
      }
    }
  };
};

export const generateSoftwareApplicationSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sentinel Data Ship',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Plataforma digital avançada para monitoramento, previsão e gestão de bioincrustação em navios da Transpetro com Big Data, Machine Learning e compliance NORMAM-401',
    url: siteUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Transpetro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://static.readdy.ai/image/5da477fdae7b1d111ee386eccbf37db2/732a02039d321f0d322d28065ca5f71b.png'
      }
    }
  };
};

export const generateOrganizationSchema = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sentinel Data Ship',
    url: siteUrl,
    logo: 'https://static.readdy.ai/image/5da477fdae7b1d111ee386eccbf37db2/732a02039d321f0d322d28065ca5f71b.png',
    description: 'Plataforma digital avançada para monitoramento, previsão e gestão de bioincrustação em navios da Transpetro',
    sameAs: []
  };
};
