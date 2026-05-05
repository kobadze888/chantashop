'use client';

import { Instagram, Facebook, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import Logo from './Logo';

export default function Footer() {
  const t = useTranslations('Footer');
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Navigation');

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 md:rounded-t-[3rem] mt-auto relative z-10 overflow-hidden">
      {/* ზედა დეკორატიული ხაზი */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-DEFAULT via-purple-500 to-brand-DEFAULT"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* სექცია 1: ლოგო და აღწერა */}
          <div className="space-y-6">
            <Logo variant="light" className="!p-0" />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {t('desc')}
            </p>
          </div>

          {/* სექცია 2: სწრაფი ბმულები */}
          <div>
            <h5 className="font-bold mb-8 text-lg font-serif">
              {t('navigation')}
            </h5>
            <ul className="text-sm text-white/60 space-y-4">
              <li>
                <Link href="/" className="hover:text-white transition flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-brand-DEFAULT opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                  {tCommon('home')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-brand-DEFAULT opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                  {tNav('shop')}
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-brand-DEFAULT opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                  {tNav('trackOrder')}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 text-brand-DEFAULT opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                  {tNav('wishlist')}
                </Link>
              </li>
            </ul>
          </div>

          {/* სექცია 3: კონტაქტი */}
          <div>
            <h5 className="font-bold mb-8 text-lg font-serif">
              {t('contact')}
            </h5>
            <ul className="text-sm text-white/60 space-y-5">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-DEFAULT transition-colors">
                  <Phone className="w-4 h-4 text-brand-DEFAULT group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold">ტელეფონი</p>
                  <a href="tel:+995555000000" className="text-white group-hover:text-brand-DEFAULT transition-colors">+995 555 XX XX XX</a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-DEFAULT transition-colors">
                  <Mail className="w-4 h-4 text-brand-DEFAULT group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold">ელ-ფოსტა</p>
                  <a href="mailto:info@chantashop.ge" className="text-white group-hover:text-brand-DEFAULT transition-colors">info@chantashop.ge</a>
                </div>
              </li>
            </ul>
          </div>

          {/* სექცია 4: სოციალური ქსელები */}
          <div>
            <h5 className="font-bold mb-8 text-lg font-serif">
              {t('followUs')}
            </h5>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition-all group"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition" />
              </a>
            </div>
          </div>
        </div>

        {/* ქვედა ზოლი */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
          <p>&copy; 2025 ChantaShop. {t('rights')}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-white transition">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}