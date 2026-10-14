import React from "react";

import { SITE_NAME, SITE_URL } from "@/lib/seo";

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/android-chrome-512x512.png`,
  sameAs: ["https://github.com/JoshuaMarkle/algotype"],
};

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        description: "Typing practice for programmers",
        url: `${SITE_URL}/`,
        publisher: { "@id": ORGANIZATION["@id"] },
      },
      ORGANIZATION,
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description:
          "Typing practice for programmers: type real LeetCode solutions, source files and syntax drills and track your WPM and accuracy.",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": ORGANIZATION["@id"] },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
