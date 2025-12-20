import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return {};

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.metaDesc,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-serif font-black text-brand-dark mb-8 text-center">
          {page.title}
        </h1>
        <div 
          className="prose prose-lg max-w-none text-gray-600 leading-relaxed prose-headings:font-serif prose-headings:text-brand-dark prose-a:text-brand-DEFAULT"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    </div>
  );
}