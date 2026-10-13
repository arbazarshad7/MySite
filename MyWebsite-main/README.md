# ARBAZ ARSHAD — Portfolio

Personal portfolio of Arbaz Arshad, Game Developer. Dark, terminal/glitch-styled site featuring a pure-CSS glitch title, a terminal-style About widget, project case studies, a skills/experience breakdown, and a HyperFrames motion-video glitch-title intro.

## Pages

| Page | Description |
| --- | --- |
| `index.html` | Single-page portfolio — hero, about, projects, skills, experience, contact |
| `projects.html` | Case studies for 6 projects (games, AI, robotics) |

## Structure

```
├── index.html                 # Home page
├── projects.html              # Project case studies
├── assets/                    # Site assets (CSS, JS, fonts)
│   ├── portfolio.css          # All site styling
│   ├── site.js                # Menu toggle, nav highlight, year
│   └── fonts/                 # Space Grotesk + JetBrains Mono (woff2)
├── source/                    # HyperFrames video composition (1920x1080, 15s)
│   ├── index.html             # Glitch title motion comp (GSAP timeline)
│   ├── fonts.css / tailwind.css
│   ├── vendor/gsap.min.js
│   ├── renders/               # Rendered MP4 outputs
│   └── .thumbnails/, .hyperframes/  # Previews + auto-backups
├── .od-skills/                # Installed OpenDesign skill bundle
└── arbaz-arshad-glitch.mp4    # Rendered glitch-title intro
```

## Run

No build step or dependencies — the site is plain HTML/CSS/JS. Serve the folder statically:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

## Video composition

`source/index.html` is a HyperFrames-compatible composition: 1920×1080, 15s, 60fps, deterministic seek-safe GSAP timeline (`window.__timelines["main"]`). It renders the glitch-title intro shown in `arbaz-arshad-glitch.mp4`. Keep it self-contained under `source/` (no external network assets) to preserve headless rendering.

## Notes

- Contact links in the footer/contact section are placeholders pointing to `#contact` — replace with real GitHub/LinkedIn/email URLs.
- `NVIDIA Corporation/umdlogs` is an empty stray file; safe to delete.
- `.hyperframes/` backups, `.thumbnails/`, `renders/`, and `*.artifact.json` are generated tooling output; add them to `.gitignore` if you want a leaner history.
