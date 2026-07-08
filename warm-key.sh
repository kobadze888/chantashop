#!/bin/bash
# Gentle sequential warm of all NON-product pages after a deploy.
# Product + home pages are SSG (prebuilt) so warming them is cheap; the point
# here is the dynamic pages: shop, categories, attribute terms, content pages.
BASE="https://chantashop.ge"
URLS=$(curl -s --max-time 20 "$BASE/sitemap.xml" \
  | grep -oE '<loc>[^<]+</loc>' \
  | sed -E 's#</?loc>##g' \
  | grep -v '/product/')
N=$(echo "$URLS" | grep -c .)
echo "[warm-key] warming $N non-product urls (sequential)"
i=0
while IFS= read -r u; do
  [ -z "$u" ] && continue
  curl -s -o /dev/null --max-time 30 "$u"
  i=$((i+1))
  sleep 0.3
done <<< "$URLS"
echo "[warm-key] done ($i)"
