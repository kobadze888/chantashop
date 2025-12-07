import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/layout/Header'; 
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "ChantaShop - Iconic Luxury",
  description: "Premium Bags and Accessories",
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
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=BPG+Nino+Mtavruli&display=swap" rel="stylesheet" />
        <style>{`:root { --font-bpg: 'BPG Nino Mtavruli', sans-serif; }`}</style>
      </head>
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