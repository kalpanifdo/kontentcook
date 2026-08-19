# Kontent Cook

Static single-page portfolio for `kontentcook.com`. No framework, dependency,
or build step is required.

## Preview

```bash
npx serve .
```

## Vercel

Import this directory as a new Vercel project and choose **Other** as the
framework preset. Leave Build Command and Output Directory empty. The supplied
`vercel.json` adds caching and security headers.

## Hero interaction

- Desktop: scroll position scrubs through one frame-accurate eight-second film.
  The timestamp and progress line show the scroll position explicitly.
- Touch/mobile: the contained film autoplays as a muted loop.
- Reduced motion: the film is replaced by its poster frame.

## Files

- `index.html` — page structure and content
- `css/site.css` — full responsive art direction and motion
- `js/site.js` — film scrub, progress, menu and entrance behavior
- `media/hero.mp4` — optimized cinematic content-creation film
- `media/poster.webp` — film poster and reduced-motion fallback
- `img/` — supplied brand, founder and client assets
