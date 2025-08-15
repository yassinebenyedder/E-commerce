'use client';

import Script from 'next/script';

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ben Yedder Parfums",
    "url": "https://benyedderparfums.tn",
    "logo": "https://benyedderparfums.tn/byp-logo.svg",
    "description": "Spécialiste en parfums de qualité premium en Tunisie. Collection exclusive de parfums femme et homme des plus grandes marques.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["French", "Arabic"]
    },
    "sameAs": [
      "https://www.facebook.com/benyedderparfums",
      "https://www.instagram.com/benyedderparfums"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Tunisia"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ben Yedder Parfums",
    "url": "https://benyedderparfums.tn",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://benyedderparfums.tn/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "fr-TN"
  };

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Ben Yedder Parfums",
    "description": "Boutique en ligne spécialisée dans les parfums de marque pour femme et homme en Tunisie",
    "url": "https://benyedderparfums.tn",
    "currenciesAccepted": "TND",
    "paymentAccepted": "Cash, Credit Card",
    "priceRange": "19.90 DT - 80 DT",
    "areaServed": "Tunisia",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Parfums Collection",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Coco Chanel",
            "category": "Parfums Femme",
            "brand": "Chanel"
          },
          "price": "19.90",
          "priceCurrency": "TND"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "L'Interdit Rouge",
            "category": "Parfums Femme",
            "brand": "Givenchy"
          },
          "price": "19.90",
          "priceCurrency": "TND"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Black Opium",
            "category": "Parfums Femme",
            "brand": "Yves Saint Laurent"
          },
          "price": "19.90",
          "priceCurrency": "TND"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "La Vie Est Belle",
            "category": "Parfums Femme",
            "brand": "Lancôme"
          },
          "price": "19.90",
          "priceCurrency": "TND"
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="store-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeSchema),
        }}
      />
    </>
  );
}
