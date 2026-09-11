# Solenne Vane — pre-launch notes

Static site, no build step, no backend. Deployable as-is to GitHub Pages,
Netlify, or any static host. A few things are placeholder — swap these
before calling it launch-ready:

## Must do before real launch

1. **Product photography.** Every image is a generated garnet/brass vector
   plate (`js/plate.js`), not a photo — deliberate (no random unrelated
   stock photos), but still a stand-in. Add an `image` field per product in
   `js/products.js` and use it in `js/shop.js` / `js/main.js` once real
   photography exists.
2. **Brand facts.** "By appointment only" and the delivery timeline are
   placeholder. Replace with the real business's actual details.
3. **Newsletter form.** `<form data-newsletter-form>` in both HTML files
   only shows an in-browser confirmation — it sends nothing anywhere yet.
   Add a real `action` URL (Formspree, Mailchimp, etc.) before launch.
4. **Cart/checkout.** The bag counter is visual + `localStorage` only. No
   payment flow. Needs a real integration (Stripe Checkout, Shopify, etc.)
   if this is meant to actually sell online.

## Already handled

- Mobile nav (hamburger menu) works independently of the desktop layout.
- Favicon generated inline — nothing missing.
- `robots.txt`, `sitemap.xml`, themed `404.html`.
- Open Graph / canonical tags on both pages (update the domain once a
  custom domain is added).
- Reduced-motion respected — the helix and ticker stop animating for
  anyone with that OS preference.

## File map

```
index.html      Home — spotlight hero, vertical helix motion, editorial spread
shop.html       Full 110-piece catalogue — horizontal filter bar, search, sort, quick view
css/style.css   All styling
js/products.js  Catalogue data (60 dresses + 50 accessories)
js/plate.js     Placeholder product art (swap per note #1 above)
js/main.js      Nav, mobile menu, cursor spotlight, helix animation, cart, toasts
js/shop.js      Shop filtering / search / sort / modal logic
```
