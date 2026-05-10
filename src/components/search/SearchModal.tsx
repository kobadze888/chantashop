'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { searchProducts, type SearchableProduct } from '@/lib/transliterate';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Formatted price helper — strips trailing zeros, prepends ₾ */
function fmt(price?: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (isNaN(n)) return null;
  return `${n.toFixed(0)}₾`;
}

export default function SearchModal({ open, onClose }: Props) {
  const t       = useTranslations('Common');
  const tSearch = useTranslations('Search');
  const [query, setQuery] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [products, setProducts] = useState<SearchableProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Fetch search index lazily on first open */
  useEffect(() => {
    if (open && !fetched) {
      setLoading(true);
      fetch('/api/search')
        .then(r => r.json())
        .then(data => { setProducts(Array.isArray(data) ? data : []); setFetched(true); })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [open, fetched]);

  /* Auto-focus input when modal opens */
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* Debounce query for smoother typing */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  /* ESC key + body scroll lock */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!debouncedQ.trim()) return [];
    return searchProducts(debouncedQ, products);
  }, [debouncedQ, products]);

  if (!open) return null;

  const hasQuery = debouncedQ.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 top-0 bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4">
          {/* Search header row */}
          <div className="flex items-center gap-2 md:gap-3
            border-b border-gray-200 pb-3 md:pb-4">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tSearch('placeholder')}
              className="flex-1 bg-transparent text-base md:text-lg outline-none
                placeholder:text-gray-400 text-brand-dark"
              autoFocus
            />
            {loading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />}
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              aria-label={t('close')}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Results area */}
          <div className="max-h-[70vh] overflow-y-auto -mx-3 md:-mx-6 px-3 md:px-6 pt-3 pb-4">
            {!hasQuery && (
              <div className="text-center text-gray-400 py-12 px-4">
                <p className="text-sm md:text-base">{tSearch('hint')}</p>
                <p className="text-xs md:text-sm mt-2 text-gray-300">
                  {tSearch('examples')}
                </p>
              </div>
            )}

            {hasQuery && results.length === 0 && !loading && (
              <div className="text-center text-gray-400 py-12">
                <p className="text-sm md:text-base">{tSearch('noResults')}</p>
              </div>
            )}

            {hasQuery && results.length > 0 && (
              <ul className="divide-y divide-gray-100">
                {results.map(p => (
                  <li key={p.id}>
                    <Link
                      href={{ pathname: '/product/[slug]', params: { slug: p.slug } }}
                      onClick={onClose}
                      className="group flex items-center gap-3 md:gap-4 py-3
                        hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0
                        rounded-lg overflow-hidden bg-zinc-100">
                        <Image
                          src={p.image || '/placeholder.jpg'}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-medium text-brand-dark
                          line-clamp-2 leading-tight group-hover:text-brand-DEFAULT transition-colors">
                          {p.name}
                        </h3>
                        {p.categories && p.categories.length > 0 && (
                          <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 truncate">
                            {p.categories.slice(0, 2).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {fmt(p.salePrice ?? p.price) && (
                          <span className="text-sm md:text-base font-bold text-brand-dark">
                            {fmt(p.salePrice ?? p.price)}
                          </span>
                        )}
                        {p.salePrice && p.regularPrice && p.salePrice !== p.regularPrice && (
                          <div className="text-[10px] md:text-xs text-gray-400 line-through">
                            {fmt(p.regularPrice)}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300
                        group-hover:text-brand-DEFAULT group-hover:translate-x-0.5
                        transition-all shrink-0 hidden sm:block" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
