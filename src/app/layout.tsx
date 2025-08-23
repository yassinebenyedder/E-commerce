import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ben Yedder Parfums - Parfums de Qualité Premium | Chanel, Givenchy, YSL",
  description: "✨ Découvrez les meilleurs parfums femme et homme: Coco Chanel, L'Interdit Rouge Givenchy, Black Opium YSL, La Vie Est Belle Lancôme. Livraison gratuite dès 50 DT. Prix de 19.90 à 80 DT.",
  keywords: ["parfums tunisie", "parfums femme", "parfums homme", "chanel tunisie", "givenchy tunisie", "ysl tunisie", "lancôme tunisie", "parfums pas cher", "parfums de marque", "ben yedder parfums"],
  authors: [{ name: "Ben Yedder Parfums" }],
  creator: "Ben Yedder Parfums",
  publisher: "Ben Yedder Parfums",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://benyedderparfums.tn'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-TN': '/',
      'ar-TN': '/',
    },
  },
  openGraph: {
    title: "Ben Yedder Parfums - Parfums de Qualité Premium",
    description: "Découvrez les meilleurs parfums: Chanel, Givenchy, YSL, Lancôme. Livraison gratuite dès 50 DT.",
    url: 'https://benyedderparfums.tn',
    siteName: 'Ben Yedder Parfums',
    locale: 'fr_TN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ben Yedder Parfums - Collection Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ben Yedder Parfums - Parfums Premium",
    description: "Parfums de marque: Chanel, Givenchy, YSL. Livraison gratuite dès 50 DT.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="geo.region" content="TN" />
        <meta name="geo.country" content="Tunisia" />
        <meta name="ICBM" content="36.8065,10.1815" />
        <meta name="DC.title" content="Ben Yedder Parfums - Parfums Premium Tunisie" />
        <link rel="canonical" href="https://benyedderparfums.tn" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
