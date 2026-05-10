/**
 * Search engine: transliteration (KA ↔ EN ↔ RU) + fuzzy matching
 *
 * Handles:
 *  - "ჩანთა" / "chanta" / "tanta"  (Georgian ↔ Latin)
 *  - "сумка" / "sumka"             (Russian → Latin)
 *  - "guci" → matches "Gucci"      (typos / Levenshtein)
 *  - case-insensitive everywhere
 */

/* ─── Georgian → Latin (single char) ──────────────────────────────── */
const KA_TO_LATIN: Record<string, string> = {
  'ა':'a','ბ':'b','გ':'g','დ':'d','ე':'e','ვ':'v','ზ':'z','თ':'t',
  'ი':'i','კ':'k','ლ':'l','მ':'m','ნ':'n','ო':'o','პ':'p','ჟ':'zh',
  'რ':'r','ს':'s','ტ':'t','უ':'u','ფ':'f','ქ':'q','ღ':'gh','ყ':'y',
  'შ':'sh','ჩ':'ch','ც':'ts','ძ':'dz','წ':'w','ჭ':'tch','ხ':'kh',
  'ჯ':'j','ჰ':'h',
};

/* ─── Latin → Georgian (multi-char first to grab digraphs) ────────── */
const LATIN_TO_KA_MULTI: [string, string][] = [
  ['tch','ჭ'],['shch','შჩ'],
  ['sh','შ'],['ch','ჩ'],['ts','ც'],['dz','ძ'],
  ['kh','ხ'],['gh','ღ'],['zh','ჟ'],
];

const LATIN_TO_KA_SINGLE: Record<string, string> = {
  'a':'ა','b':'ბ','g':'გ','d':'დ','e':'ე','v':'ვ','z':'ზ','t':'ტ',
  'i':'ი','k':'კ','l':'ლ','m':'მ','n':'ნ','o':'ო','p':'პ',
  'r':'რ','s':'ს','u':'უ','f':'ფ','q':'ქ','y':'ყ','j':'ჯ','h':'ჰ',
  'w':'წ','x':'ხ','c':'ც',
};

/* ─── Cyrillic → Latin (Russian) ──────────────────────────────────── */
const RU_TO_LATIN: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh',
  'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
  'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
  'ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
};

/** Convert any script (Georgian / Cyrillic) to Latin transliteration. */
export function toLatin(text: string): string {
  return text.toLowerCase().split('').map(ch =>
    KA_TO_LATIN[ch] ?? RU_TO_LATIN[ch] ?? ch
  ).join('');
}

/** Convert Latin to Georgian (best-effort; some chars are ambiguous, e.g. t = ტ/თ). */
export function toGeorgian(text: string): string {
  let result = text.toLowerCase();
  for (const [latin, ka] of LATIN_TO_KA_MULTI) {
    result = result.split(latin).join(ka);
  }
  result = result.split('').map(ch => LATIN_TO_KA_SINGLE[ch] ?? ch).join('');
  return result;
}

/* ─── Levenshtein distance (DP, small alloc) ──────────────────────── */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/* ─── Fuzzy match score 0–1 ───────────────────────────────────────── */
function matchScore(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.trim();
  const t = target.trim();
  if (!q || !t) return 0;

  // Exact substring — highest score
  if (t.includes(q)) {
    if (t === q) return 1.0;
    if (t.startsWith(q)) return 0.95;
    if (t.includes(' ' + q) || t.includes('-' + q)) return 0.9;
    return 0.85;
  }

  // Fuzzy only for queries 3+ chars
  if (q.length < 3) return 0;

  // Per-word fuzzy
  const words = t.split(/[\s\-_]+/).filter(w => w.length >= 2);
  let best = 0;
  for (const word of words) {
    // Compare query against word and word's prefix (allow query to be shorter)
    const candidates = [word];
    if (word.length > q.length) candidates.push(word.slice(0, q.length + 1));

    for (const cand of candidates) {
      const dist = levenshtein(q, cand);
      const allowed = Math.max(1, Math.floor(q.length / 4));
      if (dist <= allowed) {
        const score = 0.6 + 0.3 * (1 - dist / Math.max(q.length, 1));
        if (score > best) best = score;
      }
    }
  }
  return best;
}

/* ─── Public search API ───────────────────────────────────────────── */
export interface SearchableProduct {
  id: number | string;
  name: string;
  slug: string;
  image?: string;
  price?: string;
  salePrice?: string;
  regularPrice?: string;
  categories?: string[];
}

/**
 * Filter and rank products by query.
 * Generates Latin/Georgian variants of the query, scores each product
 * across name + slug + categories, and returns top matches sorted by score.
 */
export function searchProducts(rawQuery: string, products: SearchableProduct[]): SearchableProduct[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  // Build query variants (original + transliterations)
  const queryVariants = new Set<string>([query, toLatin(query), toGeorgian(query)]);
  const queries = [...queryVariants].filter(Boolean);

  const scored = products.map(p => {
    // Searchable fields per product
    const fields = [
      p.name,
      p.slug.replace(/-/g, ' '),
      ...(p.categories ?? []),
    ].filter(Boolean);

    let bestScore = 0;
    for (const field of fields) {
      const fLower = field.toLowerCase();
      const fieldVariants = new Set<string>([fLower, toLatin(fLower)]);

      for (const q of queries) {
        for (const f of fieldVariants) {
          const score = matchScore(q, f);
          if (score > bestScore) bestScore = score;
          if (bestScore >= 1.0) break;
        }
        if (bestScore >= 1.0) break;
      }
      if (bestScore >= 1.0) break;
    }

    return { product: p, score: bestScore };
  });

  return scored
    .filter(s => s.score >= 0.6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(s => s.product);
}
