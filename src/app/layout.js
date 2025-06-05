import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import StructuredData from "@/components/seo/StructuredData";
import "@/app/globals.css";

export const metadata = {
  title: "AlgoType | Typing Practice For Programmers",
  description:
    "AlgoType.net is designed to help programmers train their typing skills on syntax and special characters.",
  openGraph: {
    url: "https://algotype.net",
    title: "AlgoType | Typing Practice For Programmers",
    description:
      "AlgoType.net is designed to help programmers train their typing skills on syntax and special characters.",
    images: [
      {
        url: "https://algotype.net/twitter-card.png",
        width: 1200,
        height: 630,
        alt: "AlgoType Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoType | Typing Practice For Programmers",
    description:
      "AlgoType.net is designed to help programmers train their typing skills on syntax and special characters.",
    images: ["https://algotype.net/twitter-card.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body
        className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
