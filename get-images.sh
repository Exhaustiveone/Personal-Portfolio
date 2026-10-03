#!/bin/bash
# Downloads the Kidureka product images into assets/img/kidureka so the site
# never depends on another server. Run once from this folder:  bash get-images.sh
cd "$(dirname "$0")"
mkdir -p assets/img/kidureka
grep -o '\["[a-z0-9-]*\.webp", "https://[^"]*"\]' assets/js/data.js | while read -r line; do
  file=$(echo "$line" | sed -E 's/\["([^"]+)".*/\1/')
  url=$(echo "$line" | sed -E 's/.*, "([^"]+)"\]/\1/')
  echo "Downloading $file"
  curl -sSL "$url" -o "assets/img/kidureka/$file" || echo "  could not download $url"
done
echo "Done. Reload the site."
