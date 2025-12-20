// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Georgian } from "next/font/google"; // დავამატეთ Noto_Sans_Georgian
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header'; 
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import "../globals.css";

// 1. Inter - ძირითადი ტექსტისთვის
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter', 
  display: 'swap' 
});

// 2. Playfair Display - სერიფული სათაურებისთვის
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair', 
  display: 'swap' 
});

// 3. Noto Sans Georgian - ქართული ტექსტისთვის (ნაცვლად BPG Nino-სი)
// ეს ფონტი ძალიან სწრაფია და იტვირთება პირდაპირ Google-დან Next.js-ის მიერ
const notoGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: '--font-noto-georgian',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chantashop.ge'),
  title: {
    default: "ChantaShop - Iconic Luxury",
    template: "%s | ChantaShop",
  },
  description: "Premium Bags and Accessories",
  openGraph: {
    siteName: 'ChantaShop',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} ${notoGeorgian.variable}`}>
      <body className="font-sans antialiased selection:bg-brand-DEFAULT selection:text-white pb-24 md:pb-0 bg-white text-brand-dark">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}