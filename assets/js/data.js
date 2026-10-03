/* ==========================================================================
   SITE CONTENT
   Every word and image on the site is set here. Edit this file to change
   text, add photos, add design work or update films. Images live in assets/img.
   ========================================================================== */

window.SITE = {
  name: "Mayank Sharma",
  email: "mayankji2005@gmail.com",
  whatsapp: "918619187558",
  instagram: "shunya.a.aakar02",
  city: "Jaipur",

  intro:
    "I photograph, I design and I make films. Three ways of looking at the same thing: what a moment feels like, and how to make someone else feel it too.",

  /* ======================= WORLD 01: PHOTOGRAPHY ======================= */
  photography: {
    statement:
      "Every frame is a decision. I shoot events, streets and the roads in between, and I edit warm, a little moody, so it feels like a memory and not a report.",
    // Rows are laid out edge to edge at the photos' true proportions. Nothing is cropped.
    // w and h are the real pixel sizes of each file, so the layout never jumps.
    rows: [
      ["platform-zero", "waiting-fleet", "devotion-stillness"],
      ["built-by-time"],
      ["one-who-watches", "bridge-midnight"],
      ["rubble-resilience", "echoes-empire"],
      ["pushkar"]
    ],
    photos: {
      "platform-zero": { title: "Platform Zero", kind: "Architecture", w: 1463, h: 2048 },
      "waiting-fleet": { title: "The Waiting Fleet", kind: "Travel", w: 2048, h: 1365 },
      "devotion-stillness": { title: "Devotion in Stillness", kind: "Fine art", w: 1365, h: 2048 },
      "built-by-time": { title: "Built by Time", kind: "Architecture", w: 2200, h: 848 }, // sizes update themselves from the real file
      "one-who-watches": { title: "The One Who Watches", kind: "Street", w: 2048, h: 1365 },
      "bridge-midnight": { title: "The Bridge at Midnight", kind: "Night", w: 1467, h: 2200 },
      "rubble-resilience": { title: "Rubble & Resilience", kind: "Candid", w: 2048, h: 1365 },
      "echoes-empire": { title: "Echoes of Empire", kind: "Architecture", w: 2048, h: 1638 },
      pushkar: { title: "Pushkar Doesn't Hurry", kind: "Travel", w: 2200, h: 1467 }
    },
    rules: [
      ["Show up first", "The camera comes out after I've watched for a while."],
      ["Events teach speed", "One moment, no retakes. A crowd teaches instinct faster than any tutorial."],
      ["Keep the ones you return to", "Not the perfect ones. The ones I open again three days later for no reason."]
    ]
  },

  /* ======================= WORLD 02: GRAPHIC DESIGN ======================= */
  design: {
    statement:
      "Design is the architecture of attention. It should solve the brief, then do one thing the brief didn't ask for: make the object feel like it couldn't have looked any other way.",
    job: {
      company: "Sierra Innovations",
      role: "Graphic Designer",
      since: "July 2026",
      line: "In-house designer for two of the company's brands, from the first sketch to the file that ships."
    },

    kidureka: {
      name: "Kidureka",
      about: "Educational and creative toys, STEM kits and books for children.",
      did: ["Product page mockups", "Google ads", "Amazon A+ content"],
      // Images: each product tries the local file first (run get-images.sh once),
      // and falls back to the live Kidureka image if the local file is missing.
      products: [
        {
          slug: "airplane-launcher",
          name: "Airplane Launcher",
          tag: "DIY STEAM kit, 8+",
          url: "https://www.kidureka.com/product/airplane-launcher",
          images: [
            ["airplane-launcher-1.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/products/thumbnails/b8284d66-1cf7-46a0-a678-90a74a2f46db.webp"],
            ["airplane-launcher-2.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/Products/20260817190930_GW6mcE.webp"]
          ],
          why: "A toy about motion, sold to parents who scroll fast. The mockup leads with the moment of launch, then shows the build, so play and learning land in the same glance."
        },
        {
          slug: "math-mentalist",
          name: "Math Mentalist",
          tag: "Maths + magic kit, 8+",
          url: "https://www.kidureka.com/product/math-mentalist",
          images: [
            ["math-mentalist-1.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/products/thumbnails/06a64452-e383-4dcd-b3df-105bafe17796.webp"],
            ["math-mentalist-2.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/Products/20260909121412_Q0fUxQ.jpeg"]
          ],
          why: "Maths sold as a stage act. The design borrows the language of a magic show so a child sees a trick to perform, not homework to finish."
        },
        {
          slug: "mumma-story",
          name: "Mumma, What's Your Story?",
          tag: "Guided memory journal",
          url: "https://www.kidureka.com/product/mumma-story",
          images: [
            ["mumma-story-1.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/products/thumbnails/d03be68d-0595-4bf6-b0b2-00e950bd7dd1.webp"],
            ["mumma-story-2.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/Products/20260730172857_G8jUR7.webp"]
          ],
          why: "The only product in the range bought with the heart. Softer type, warmer tones and room to breathe, because this one is a gift, not a gadget."
        },
        {
          slug: "husky-rc-robo",
          name: "Husky RC Robo",
          tag: "Remote-controlled robot kit, 8+",
          url: "https://www.kidureka.com/product/husky-rc-robo",
          images: [
            ["husky-rc-robo-1.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/products/thumbnails/a276b1e4-23f6-4f29-a1d2-cdd35cd2fe57.webp"],
            ["husky-rc-robo-2.webp", "https://toppersnotes.b-cdn.net/website-content/Gallery/Products/20260810122146_LxCVHD.webp"]
          ],
          why: "A robot with a job. Framing it around a delivery mission gives the kit a story, so it reads as a character to build, not a box of parts."
        }
      ],
      process: [
        ["Hold the product", "Build it, play with it, notice what a child reaches for first."],
        ["One promise per frame", "The first image says what it is. The next ones say what a child learns."],
        ["Design for the thumb", "Every layout has to read at phone size, in a feed, in under a second."],
        ["Carry it everywhere", "The same look runs through the product page, Google ads and the Amazon A+ story."]
      ]
    },

    toppersnotes: {
      name: "Toppersnotes",
      about: "Exam preparation notes and books.",
      did: ["Book covers", "Book mockups", "Google ads"],
      line: "Covers that have to stand out on a crowded shelf and still look trustworthy to a serious student.",
      // Add your covers here, e.g. { src: "assets/img/toppersnotes/cover-1.jpg", title: "RAS Prelims" }
      covers: []
    },

    // "motive" is the one or two lines on why the piece looks the way it does
    independent: [
      { slug: "pravah-presents", title: "Pravah '25 Presents", kind: "Event branding", w: 1800, h: 1274,
        motive: "Five artists, one wall. The ornate festive frame keeps a celebrity line-up feeling like Pravah, not a generic concert ad." },
      { slug: "pravah-domains", title: "Pravah Major Domains", kind: "Poster", w: 1277, h: 1800,
        motive: "Let the name do the work: every letter of PRAVAH is a window into a different side of the festival." },
      { slug: "emmora-mockup", title: "Emmora Shatdhautghrit", kind: "Packaging", w: 1440, h: 1800,
        motive: "Ayurveda shouldn't look like a pharmacy. Rose, saffron and soft light make the jar feel like a ritual, not a remedy." },
      { slug: "wemac-standee", title: "WEMAC '26", kind: "Standee", w: 900, h: 1800,
        motive: "A standee is read from three metres in three seconds: one big promise at eye level, partners grouped lower where people pause." },
      { slug: "pravah-inaugural", title: "Pravah 2025 Inaugural", kind: "Stage backdrop", w: 720, h: 407,
        motive: "A Silver Jubilee needed scale. India's monuments form the skyline so the backdrop reads from the very last row." },
      { slug: "rethink-roads-poster", title: "Re-Think Roads 2025", kind: "Poster", w: 1131, h: 1600,
        motive: "The title sits on a lane marking, so the theme of the conclave lands before a single word is read." },
      { slug: "liceria-soap", title: "Liceria & Co.", kind: "Packaging", w: 450, h: 300,
        motive: "Natural, but not plain. A vintage apothecary label in sage makes a simple bar of soap feel handmade and giftable." },
      { slug: "rethink-roads-standee", title: "Rethinking Roads", kind: "Standee", w: 900, h: 1800,
        motive: "Shaped like a gateway with a road at its feet, so the idea of safer mobility is the first thing you walk past." },
      { slug: "emmora-label", title: "Emmora Label", kind: "Packaging", w: 450, h: 300,
        motive: "Three ingredients, three quiet accents. The label steps back and lets saffron, rosewater and chandan speak." }
    ]
  },

  /* ======================= WORLD 03: FILMMAKING ======================= */
  film: {
    statement:
      "I write, shoot and cut films. Give me a story, a brand or a song, and I'll take it from the first page to the final grade.",

    // the three crafts you can hire me for
    crafts: [
      {
        verb: "I write",
        line: "Screenplays for short films, ads and reels, in Hindi, English or Hinglish. From a one-line idea to a locked final draft.",
        offers: ["Short film screenplays", "Story development and treatments", "Ad and reel scripts", "Hindi and Hinglish dialogue", "Song lyrics"]
      },
      {
        verb: "I shoot",
        line: "Cinematography that works with the light already there. Composition first, gear second.",
        offers: ["Short films and music videos", "Brand films and reels", "Events", "Shot lists and lighting plans"]
      },
      {
        verb: "I cut",
        line: "Editing and colour, so the film you shot becomes the film people feel.",
        offers: ["Reels and short-form", "Event and brand films", "Colour grading in DaVinci Resolve", "Edits in Premiere Pro and Final Cut Pro"]
      }
    ],

    // writing sample: the opening of AHAM (final draft, page 1)
    sample: {
      source: "AHAM, final draft, page 1",
      lines: [
        ["chapter", "ROZ KA BOJH"],
        ["sub", "(The Weight of Every Day)"],
        ["scene", "EXT. KUNDANPURA RAILWAY CROSSING \u2014 DAWN"],
        ["action", "The Delhi\u2013Jaipur line, shot low along the track, pointed straight into the mist where the rails converge and vanish. No train in frame \u2014 only the sound of one, far off, not arriving. Not yet.", 1],
        ["action", "Over black, then over this image, white text:"],
        ["super", "\u0905\u0939\u092e\u094d"],
        ["action", "Five seconds. It fades before we've finished reading it \u2014 the way a thought does.", 2],
        ["char", "VEER (V.O.)"],
        ["paren", "(flat, worn smooth by repetition)"],
        ["dial", "Roz uthta hoon. Roz wahi karta hoon jo karna chahiye. Roz chup rehta hoon jab bolna chahiye."],
        ["paren", "(beat, quieter)"],
        ["dial", "Roz sochta hoon \u2014 aaj nahi. Aur roz \u2014 kuch hota hai."],
        ["action", "The camera begins to rise off the track, slow, unhurried, until the whole crossing opens beneath it \u2014 the road, the half-built colonies of Jagatpura, the sky taking over the frame.", 3]
      ],
      notes: [
        "A real place, a real hour. Dawn at a Jaipur level crossing, no set.",
        "The title appears and leaves like a thought. The audience feels it before they read it.",
        "The camera rises as Veer's voice runs out of words. The frame says what he can't."
      ]
    },

    // cinematography
    eye: {
      intro: "I light with what's already there: dawn, a street lamp, a single window. These are frames from my own stills, with the thinking that would build a shot around each one.",
      frames: [
        { slug: "platform-zero", title: "Leading lines", note: "Rails, wires and the train's roof all run to one point. The eye has nowhere else to go.",
          guides: { lines: [[8, 100, 80, 50], [58, 100, 80, 50], [0, 36, 80, 50], [84, 100, 80, 50], [0, 18, 80, 50]], dot: [80, 50] } },
        { slug: "bridge-midnight", title: "Practical light", note: "No kit, only the street lamps. Let the dark be dark and the light will mean something.",
          guides: { lamps: [[80, 30], [23, 40]], lines: [[30, 100, 50, 68], [72, 100, 50, 68]] } },
        { slug: "one-who-watches", title: "Frame within a frame", note: "The bridge boxes him in twice over. You read loneliness before you read the man.",
          guides: { rect: [20, 10, 62, 70], dot: [29.5, 64] } }
      ],
      kit: ["Sony a6100", "Natural light, reflectors", "Shot lists and lighting breakdowns per scene", "Colour in DaVinci Resolve"]
    },

    // REELS: add your reels here and they appear on the site.
    // A video file:      { title: "Café launch", src: "assets/reels/cafe.mp4", poster: "assets/reels/cafe.jpg", role: "Shot and edited" }
    // An Instagram reel: { title: "Café launch", src: "https://www.instagram.com/reel/XXXXXXXX/", poster: "assets/reels/cafe.jpg" }
    // A YouTube short:   { title: "Café launch", src: "https://youtube.com/shorts/XXXXXXXX" }
    reels: [],
    reelsIntro: "Short-form work I shot on my own camera and cut myself, start to finish.",
    reelsLink: "https://instagram.com/shunya.a.aakar02",

    feature: {
      title: "AHAM",
      devanagari: "अहम्",
      tagline: "A film about the self that hides, and the self that answers.",
      logline:
        "Veer swallows every insult the world hands him. The Other, the self he keeps buried, does not. A mythological, psychological short shot on the real streets of Jagatpura.",
      status: "Pre-production",
      stats: [
        { n: 29, label: "scenes" },
        { n: 3, label: "chapters" },
        { n: 23, label: "page final draft" },
        { n: 7, label: "shooting Sundays" }
      ],
      chapters: ["Roz Ka Bojh", "Pehli Baar", "Raat Ka Hisaab"],
      notes: [
        "Warm, soft light for Veer. Hard, single-source cold light for The Other.",
        "Natural light only. One Sony a6100. No lighting kit.",
        "Score built on a damru motif and heavy drums. Original song: Kalyug Charam."
      ]
    },
    slate: [
      { poster: "wave", title: "Humsaya", hook: "The companion who arrives with you at birth.", genre: "Psychological horror", status: "Screenplay", line: "A zero-VFX horror where the scariest thing in the room is a sound. Built on the myth of the Qareen, the companion who arrives with you at birth." },
      { poster: "rings", title: "Smriti", hook: "Some memories were never yours.", genre: "Supernatural mystery", status: "Screenplay complete", line: "A non-linear mystery about memory, identity and an ancient banyan tree in the hills of Uttarakhand." },
      { poster: "thread", title: "Nanhni Muskan", hook: "One in a million. One red thread.", genre: "Drama", status: "In development", line: "A student, a girl in a red dress who isn't there, and a one-in-a-million stem cell match. A film about thalassemia." }
    ],
    studio: {
      name: "Shunyaakar",
      meaning: "शून्य + आकार: form, out of nothing",
      line: "I'm building a production house. It starts with these short films and grows, one discipline at a time, into a home for every part of making a story.",
      url: "", // add the studio website here to show a "Visit the studio" button
      verticals: [
        { name: "Films", when: "Now", line: "Short films, written and directed in-house." },
        { name: "Music", when: "Next", line: "Original scores and songs, starting with AHAM." },
        { name: "VFX", when: "Later", line: "Visual effects, built on what the films need." },
        { name: "Animation", when: "Later", line: "2D and motion work, from titles to full pieces." }
      ]
    }
  },

  /* ======================= TOOLKIT ======================= */
  tools: [
    { key: "ps", name: "Photoshop", maker: "Adobe", use: "Compositing, retouching and every poster on this page.", color: "#4fb4ff" },
    { key: "ai", name: "Illustrator", maker: "Adobe", use: "Labels, logos and vectors that have to scale from a sticker to a standee.", color: "#ff9a1f" },
    { key: "pr", name: "Premiere Pro", maker: "Adobe", use: "Reels, event films and ad edits.", color: "#b48cff" },
    { key: "fcp", name: "Final Cut Pro", maker: "Apple", use: "Fast, fluid cuts on the Mac for short films.", color: "#ff4f8b" },
    { key: "fd", name: "Final Draft", maker: "Final Draft", use: "Every screenplay in the film world.", color: "#e9e2d0" }
  ]
};
