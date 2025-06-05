import React from "react";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AlgoType",
    description: "Typing practice for programmers",
    url: "https://algotype.net/",
    publisher: {
      "@type": "Organization",
      name: "AlgoType",
      url: "https://algotype.net/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
