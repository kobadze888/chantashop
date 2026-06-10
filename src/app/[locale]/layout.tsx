import type { Metadata } from "next";
import { Manrope, Noto_Sans_Georgian } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import "../globals.css";

// ── Typography: one clean sans system ──

// Manrope — Latin sans (body + headings). Also the source of "ManropeNum" digits.
const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
  display: 'swap',
});

// Noto Sans Georgian — Georgian sans (body + headings)
const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: '--font-ka-sans',
  display: 'swap',
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
    <html lang={locale} className={`${manrope.variable} ${notoSansGeorgian.variable}`}>
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