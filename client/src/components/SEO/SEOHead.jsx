import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "VCX MART - India's Premier Multi-Vendor Ecommerce Marketplace",
  description = "VCX MART is India's leading multi-vendor ecommerce platform where sellers can list products and customers can buy everything from electronics, fashion, home goods to books. Join thousands of sellers and millions of buyers on VCX MART.",
  keywords = "ecommerce, online shopping, multi-vendor marketplace, buy online, sell online, electronics, fashion, home goods, books, India marketplace, VCX MART",
  image = "/og-image.png",
  url = "https://vcxmart.com",
  type = "website",
  author = "VCX MART",
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  price,
  currency = "INR",
  availability = "InStock",
  brand = "VCX MART",
  noIndex = false,
  noFollow = false,
  canonicalUrl,
  alternateUrls = [],
  breadcrumbs = [],
  products = [],
  organization = true
}) => {
  const fullTitle = title.includes('VCX MART') ? title : `${title} | VCX MART`;
  const fullUrl = url.startsWith('http') ? url : `https://vcxmart.com${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://vcxmart.com${image}`;
  
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1'
  ].join(', ');

  const structuredData = [];

  // Website structured data
  if (organization) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "VCX MART",
      "url": "https://vcxmart.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://vcxmart.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });
  }

  // Breadcrumb structured data
  if (breadcrumbs.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url.startsWith('http') ? crumb.url : `https://vcxmart.com${crumb.url}`
      }))
    });
  }

  // Product structured data
  if (products.length > 0) {
    products.forEach(product => {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "brand": {
          "@type": "Brand",
          "name": product.brand || brand
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": currency,
          "availability": `https://schema.org/${product.availability || availability}`,
          "seller": {
            "@type": "Organization",
            "name": "VCX MART"
          }
        },
        "aggregateRating": product.rating ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating.value,
          "reviewCount": product.rating.count
        } : undefined
      });
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {alternateUrls.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="VCX MART" />
      <meta property="og:locale" content="en_IN" />
      
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          <meta property="article:author" content={author} />
        </>
      )}
      
      {price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
        </>
      )}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vcxmart" />
      <meta name="twitter:creator" content="@vcxmart" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      <meta name="theme-color" content="#f59e0b" />
      <meta name="msapplication-TileColor" content="#f59e0b" />
      
      <link rel="preload" href="/logo.png" as="image" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//api.vcxmart.com" />
    </Helmet>
  );
};

export default SEOHead;