# Madison Barrier — Portfolio

A personal portfolio showcasing psychology research, computer science projects, community arts, theatre, and photography.

## Preview locally

The ready-to-view website is in `dist/`. From this repository, run:

```sh
python3 -m http.server 8080 --directory dist
```

Then open http://localhost:8080.

## Update the portfolio

- `home.html`: home-page introduction, résumé button, and theatre overview.
- `pages.mjs`: Research, Projects, Extracurriculars, and slideshow content.
- `build.mjs`: shared navigation, footer, metadata, and selected-work cards.
- `dist/theme.css`: base styles.
- `dist/editorial.css`: current colors, typography, responsive layouts, and interaction styles.
- `dist/show-carousel.js`: manual slideshow navigation.
- `dist/media.js`: media playback, contact controls, and reduced-motion behavior.
- `dist/assets/`: optimized photographs, graphics, presentations, fonts, and video.

After editing the templates or styles, regenerate all pages with Node.js:

```sh
node pages.mjs
```

Publish the contents of `dist/` on a static website host. The site uses root-relative links and should be served from a domain root.

## Content and images

Portfolio text and assets belong to Madison Barrier or come from materials she supplied for this portfolio. Preserve any included font licenses and photographer credits. Linked Google Drive documents retain their existing access permissions. This repository does not grant permission to reuse portfolio photographs or documents.
