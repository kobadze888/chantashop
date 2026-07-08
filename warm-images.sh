#!/bin/bash
# Gently pre-optimize (warm) the Next.js image cache so photos don't lag on the
# first visit after a deploy. Sequential + small sleeps = safe for the 2-core box.
BASE="https://chantashop.ge"
ACCEPT="Accept: image/avif,image/webp,image/*,*/*;q=0.8"

# Pages whose images we warm: home + all KA product + KA category pages.
PAGES=$( {
  printf '%s\n' "$BASE/"
  curl -s --max-time 20 "$BASE/sitemap.xml" \
    | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' \
    | grep -E '/product/|/product-category/' \
    | grep -vE '/(en|ru)/'
} )

total=0
while IFS= read -r page; do
  [ -z "$page" ] && continue
  # extract distinct /_next/image URLs referenced by this page
  imgs=$(curl -s --max-time 25 "$page" \
    | grep -oE '/_next/image\?url=[^" ]+' \
    | sed 's/&amp;/\&/g' \
    | sort -u)
  while IFS= read -r ip; do
    [ -z "$ip" ] && continue
    curl -s -o /dev/null -H "$ACCEPT" --max-time 30 "$BASE$ip"
    total=$((total+1))
    sleep 0.12
  done <<< "$imgs"
  sleep 0.15
done <<< "$PAGES"
echo "[warm-images] done ($total image variants)"
