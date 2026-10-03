#!/bin/bash
# Rebuilds the web copies of "Built by Time" from your original photo, using the Mac's own image engine.
# Usage:  bash fix-built-by-time.sh "/path/to/your original.jpg"
cd "$(dirname "$0")"
SRC="${1:-add a subheading.jpg}"
[ -f "$SRC" ] || SRC="../add a subheading.jpg"
if [ ! -f "$SRC" ]; then
  echo "Can't find the original photo. Run:  bash fix-built-by-time.sh \"/path/to/the original.jpg\""
  exit 1
fi
sips -s format jpeg -s formatOptions 82 -Z 2200 "$SRC" --out assets/img/photo/built-by-time.jpg >/dev/null
sips -s format jpeg -s formatOptions 78 -Z 1000 "$SRC" --out assets/img/photo/built-by-time-sm.jpg >/dev/null
echo "Done. Reload the site: the gallery reads the new size by itself."
echo "If the bottom of the photo is grey, the original file is damaged. Export it again from Lightroom and run this with the new file."
