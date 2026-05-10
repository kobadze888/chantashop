/**
 * Category name translations — maps KA slug → localized display name.
 * Source: Polylang term translations in WordPress (api.chantashop.ge).
 *
 * Why: WP content (products, categories) lives under KA wpLang.
 * The API forces wpLang=KA to keep content unified across locales.
 * This map provides the localized category names for EN/RU UI.
 *
 * To regenerate from WP, query category translations via WP CLI:
 *   wp eval-file scripts/dump-translations.php
 */

type Locale = 'ka' | 'en' | 'ru';

type TranslationMap = Record<string, Record<Locale, string>>;

export const CATEGORY_NAMES: TranslationMap = {
  // ── Brands (universal — same across all languages) ──
  'chanel':         { ka: 'Chanel',         en: 'Chanel',         ru: 'Chanel' },
  'christian-dior': { ka: 'Christian Dior', en: 'Christian Dior', ru: 'Christian Dior' },
  'dolce-gabbana':  { ka: 'Dolce & Gabbana',en: 'Dolce & Gabbana',ru: 'Dolce & Gabbana' },
  'fendi':          { ka: 'Fendi',          en: 'Fendi',          ru: 'Fendi' },
  'gucci':          { ka: 'Gucci',          en: 'Gucci',          ru: 'Gucci' },
  'guess':          { ka: 'Guess',          en: 'Guess',          ru: 'Guess' },
  'lacoste':        { ka: 'Lacoste',        en: 'Lacoste',        ru: 'Lacoste' },
  'luis-vuitton':   { ka: 'Luis Vuitton',   en: 'Luis Vuitton',   ru: 'Luis Vuitton' },
  'michael-kors':   { ka: 'Michael Kors',   en: 'Michael Kors',   ru: 'Michael Kors' },
  'prada':          { ka: 'Prada',          en: 'Prada',          ru: 'Prada' },
  'versace':        { ka: 'Versace',        en: 'Versace',        ru: 'Versace' },
  'ysl':            { ka: 'YSL',            en: 'YSL',            ru: 'YSL' },

  // ── Special collections ──
  'luqsi':   { ka: 'ლუქსი',   en: 'Luxury Collection',  ru: 'Люкс коллекция' },
  'ekonomi': { ka: 'ეკონომი', en: 'Economy Line',       ru: 'Эконом линия' },

  // ── Product types ──
  'qalis_chantebi':              { ka: 'ქალის ჩანთები',           en: "Women's Handbags",        ru: 'Женские сумки' },
  'naturaluri-tyavis-chantebi':  { ka: 'ნატურალური ტყავის ჩანთები', en: 'Genuine Leather Handbags', ru: 'Сумки из натуральной кожи' },
  'kolgebi':                     { ka: 'ქოლგები',                 en: 'Umbrellas',               ru: 'Зонты' },
  'saatebi':                     { ka: 'საათები',                 en: 'Watches',                 ru: 'Часы' },
  'satvaleebi':                  { ka: 'სათვალეები',               en: 'Sunglasses',              ru: 'Очки' },
  'samgzavro-chantebi':          { ka: 'სამგზავრო ჩანთები',         en: 'Travel Bags',             ru: 'Дорожные сумки' },
  'sapuleebi':                   { ka: 'საფულეები',                en: 'Wallets',                 ru: 'Кошельки' },
  'sunamo':                      { ka: 'სუნამო',                  en: 'Perfume',                 ru: 'Духи' },
};

/** Returns localized category name; falls back to original WP name if no map entry. */
export function getCategoryName(slug: string, fallbackName: string, locale: string): string {
  const lang = (locale as Locale) ?? 'ka';
  const entry = CATEGORY_NAMES[slug];
  if (!entry) return fallbackName;
  return entry[lang] ?? entry.ka ?? fallbackName;
}
