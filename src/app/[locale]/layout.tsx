import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header'; 
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
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

// 3. Noto Sans Georgian - ქართული ძირითადი ტექსტი
const notoGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: '--font-noto-georgian',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

// 4. Noto Serif Georgian - ქართული სათაურები (700, 800, 900)
const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  variable: '--font-ka-serif',
  display: 'swap',
  weight: ['700', '800', '900'],
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
    <html lang={locale} className={`${inter.variable} ${playfair.variable} ${notoGeorgian.variable} ${notoSerifGeorgian.variable}`}>
      <body className="font-sans antialiased selection:bg-brand-DEFAULT selection:text-white pb-24 md:pb-0 bg-white text-brand-dark">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <BottomNav />
          {/* აქ ემატება Toast კომპონენტი */}
          <Toast />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}