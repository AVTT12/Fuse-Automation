# Fuse — Voice AI Agency Site

A six-page editorial-brutalist site for a Winnipeg voice AI agency, built with
GSAP + Barba.js + Three.js. Zero build step — drop the folder anywhere static.

## Pages

1. `index.html` — Home (3D voice sphere, services teaser, stats)
2. `about.html` — About (manifesto, values, Winnipeg map)
3. `services.html` — Services (4 service rows, integrations, industries)
4. `how-it-works.html` — Process (14-day, four-stage walkthrough)
5. `pricing.html` — Pricing (3 tiers + FAQ accordion)
6. `contact.html` — Contact (working form, alternates, map)

Every nav link, button, and CTA on every page leads somewhere real. Page
transitions are handled by Barba.js with a GSAP wipe overlay that reveals the
next page's name as it loads.

## Deploying to GitHub Pages

```bash
# from the fuse-site folder:
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Then in repo Settings → Pages, set Source to `main` / root. That's it — no
build, no bundler, no Node version conflicts.

## File structure

```
fuse-site/
├── index.html
├── about.html
├── services.html
├── how-it-works.html
├── pricing.html
├── contact.html
├── README.md
└── assets/
    ├── css/
    │   └── main.css        ← single design system, all pages
    └── js/
        ├── main.js          ← cursor, Barba transitions, reveals, FAQ, form
        └── sphere.js        ← Three.js voice sphere on the home page
```

## Customizing

**Brand colour, fonts, spacing** — all live as CSS variables in
`assets/css/main.css` under `:root`. Change `--coral` to swap the accent;
change `--bone` and `--ink` to repaint the theme entirely.

**Copy** — every word lives in the HTML files. No CMS, no JSON — just edit and
push. Marquee strips, stats, FAQ entries, and tier features are all plain HTML.

**The 3D sphere** — `assets/js/sphere.js`. The displacement amplitude and
colour are at the top of the file. Removing the `<script src=".../sphere.js">`
tag and the `#sphere-canvas` div takes it out cleanly.

**Contact form** — currently captures and clears (no backend). To wire it up,
either point the form at a Formspree/Basin/Getform endpoint, or swap the
`initForm()` handler in `main.js` for a `fetch()` to your own endpoint.

## Why this stack instead of React/Webflow

You mentioned React, Webflow, Figma, GSAP, Barba.js. A few honest notes:

- **Figma** is a design tool — it doesn't produce deployable code, so it's
  outside the build itself.
- **Webflow** is a hosted no-code platform. If you commit to it, the rest of
  this stack doesn't apply — Webflow has its own animation system. The two
  paths don't combine.
- **React** needs a build pipeline (Vite/Next/CRA) and a host that runs it.
  GitHub Pages serves static files, so React-built sites work but require a
  build-and-deploy step.
- **GSAP + Barba.js + Three.js via CDN** gives you the same animations and 3D
  feel as a React build, with zero setup. That's what's in this repo.

If you eventually want to migrate to React/Next, the design tokens, animation
logic, and content all transfer cleanly — they're already separated.

## Things to swap before going live

- Phone number: `+1 (204) 555-0100` appears in `nav` CTAs, footers, and the
  contact page. Find-and-replace once.
- Email: `hello@fuse.ai` — same.
- Address: `703 Corydon Ave` — placeholder. Find-and-replace once.
- Statistics on Home and About — placeholders that read plausibly. Replace
  with real numbers as you have them.
- Founder/team section — currently abstracted into the About manifesto. Add
  founder photos and bios when ready (the `.cards` grid is ideal for this).
