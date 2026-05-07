import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_Georgian } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import "../globals.css";

// 1. FiraGO - ძირითადი ქართული/ლათინური შრიფტი (Georgian + Latin + Cyrillic)
const firago = localFont({
  src: [
    { path: '../../../public/fonts/FiraGO-Regular.woff2',  weight: '400', style: 'normal' },
    { path: '../../../public/fonts/FiraGO-Medium.woff2',   weight: '500', style: 'normal' },
    { path: '../../../public/fonts/FiraGO-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../../public/fonts/FiraGO-Bold.woff2',     weight: '700', style: 'normal' },
  ],
  variable: '--font-firago',
  display: 'swap',
});

// 2. Playfair Display - ლათინური სერიფი
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
});

// 3. Noto Serif Georgian - ქართული სერიფი (700, 800, 900)
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
    <html lang={locale} className={`${firago.variable} ${playfair.variable} ${notoSerifGeorgian.variable}`}>
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