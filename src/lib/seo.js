export const SITE_URL = "https://algotype.net";
export const SITE_NAME = "AlgoType";

const OG_IMAGE = {
  url: `${SITE_URL}/twitter-card.png`,
  width: 1200,
  height: 630,
  alt: "AlgoType: typing practice for programmers",
};

// Page metadata with a canonical URL plus matching Open Graph / Twitter tags.
// Next.js does not copy a page's title into openGraph, so without this every
// shared link showed the home page title, description and URL
export function pageMetadata({ title, description, path, noindex = false }) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

// Search results cut titles at about 60 characters and descriptions at about
// 160, so drop the least useful words first when a problem name is long
const TITLE_MAX = 60;
const SUFFIX = " | AlgoType";

export function challengeTitle(name, language) {
  const options = [
    `${name} (${language}) Typing Practice${SUFFIX}`,
    `${name} (${language})${SUFFIX}`,
  ];
  return (
    options.find((title) => title.length <= TITLE_MAX) ??
    `${name} (${language})`
  );
}

export function challengeDescription(name, language, kind, lines) {
  return `Type the ${name} ${kind} in ${language} (${lines} lines) and track your WPM and accuracy.`;
}
