import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import StructuredData from "@/components/seo/StructuredData";
import PreferenceSync from "@/components/providers/PreferenceSync";
import { SETTINGS_KEY } from "@/lib/settings";
import { themeInitScript } from "@/lib/themes";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import "@/app/globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // Fallbacks; indexable pages set their own through pageMetadata
  ...pageMetadata({
    title: "AlgoType | Typing Practice For Programmers",
    description:
      "Free typing practice for programmers. Type real code and track your WPM and accuracy.",
    path: "/",
  }),
  alternates: undefined,
};

export default function RootLayout({ children }) {
  return (
    // The theme script sets data-theme on <html> before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript(SETTINGS_KEY) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          async
          defer
          src="/analytics/script.js"
          data-website-id="439c2381-526a-459f-9bf7-5f7e78943346"
          data-host-url="/analytics"
        />
      </head>
      <body
        className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <StructuredData />
        <PreferenceSync />
      </body>
    </html>
  );
}
