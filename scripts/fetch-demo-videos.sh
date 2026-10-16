#!/usr/bin/env bash
# Downloads the README demo videos of the two PCF repos into public/media/.
# GitHub's user-attachments links 404 for curl; the rendered repo page embeds
# short-lived signed URLs instead (valid ~5 minutes), so this fetches the page
# and downloads at once. The page embeds them inside escaped JSON, hence the
# pattern stops at a backslash as well as a quote.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/media

download() { # repo asset-id target-file
  local repo="$1" id="$2" out="$3" url
  url=$(curl -fsSL -A "Mozilla/5.0" "https://github.com/kh3ldar/$repo" \
        | grep -oE 'https://private-user-images\.githubusercontent\.com/[^"<> \]*' \
        | sed 's/&amp;/\&/g' | grep -F -- "$id" | head -1 || true)
  if [ -z "$url" ]; then echo "no signed URL for $id on $repo" >&2; return 1; fi
  curl -fsSL "$url" -o "$out.part"
  mv "$out.part" "$out"
  echo "$out: $(wc -c < "$out") bytes"
}

download ProductGrid    64a825af-6538-471d-a488-5eb5b160a826 public/media/productgrid-demo.mp4
download ProductAddGrid 04d68131-4dfd-4e9b-87ea-0bc7d769897c public/media/productaddgrid-demo.mp4
download ProductAddGrid 31953683-dd2b-42ec-a6ad-4d86cf18a849 public/media/productaddgrid-staging.mp4
