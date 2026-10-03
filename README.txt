MAYANK SHARMA · PORTFOLIO
=========================

1. Get the Kidureka images (once)
   Open Terminal in this folder and run:   bash get-images.sh
   (Until you do, the site loads them straight from kidureka's server.)

2. Fix "Built by Time" (once)
   Copy your original photo ("add a subheading.jpg") into this folder, then run:
   bash fix-built-by-time.sh
   The gallery picks up the photo's real shape on its own.

3. Preview locally
   python3 -m http.server 8000      then open http://localhost:8000

4. Edit content
   Everything you read on the site lives in  assets/js/data.js
   - Photos: add to assets/img/photo and list them under photography.rows / photos
   - Toppersnotes covers: put images in assets/img/toppersnotes and list them under
     design.toppersnotes.covers, e.g. { src: "assets/img/toppersnotes/cover-1.jpg", title: "RAS Prelims" }
   - Studio website button: fill in film.studio.url
   - Reels: put video files in assets/reels (make the folder) and list them under film.reels,
     or paste Instagram / YouTube Shorts links. Examples are written right above the list.
   - Design motives: design.independent[].motive  |  Film poster lines: film.slate[].hook

5. Colours and fonts: top of assets/css/style.css (:root)
