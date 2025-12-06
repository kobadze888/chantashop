// ფაილის გზა: src/app/[locale]/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from "@/components/Header"; 
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChantaShop.ge",
  description: "Online Bag Shop - Headless WooCommerce on Next.js",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string }; // params არ არის Promise App Router-ში, ეს არის სწორი ტიპი.
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header /> 
          <main className="min-h-screen">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}