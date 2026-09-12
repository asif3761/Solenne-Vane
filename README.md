# Solenne Vane (editorial-motion version) — pre-launch notes

Static site, no build step, no backend. A few things are placeholder —
swap these before calling it launch-ready:

## Must do before real launch

1. **Product photography.** Every image is a generated garnet/brass vector
   plate (`js/plate.js`) — deliberate (no random unrelated stock photos),
   but still a stand-in. Add an `image` field per product in
   `js/products.js` and use it in `js/shop.js` / `index.html` once real
   photography exists. The lookbook section in particular (sticky image
   crossfading between pieces) will look considerably better with real
   photos than with vector plates.
2. **Brand facts.** "By appointment only" and the delivery timeline are
   placeholder — replace with the real business's actual details.
3. **Newsletter form.** `<form data-newsletter-form>` only shows an
   in-browser confirmation — add a real `action` URL (Formspree,
   Mailchimp, etc.) before launch.
4. **Cart/checkout.** The bag counter is visual + `localStorage` only, no
   payment flow. Needs a real integration if this is meant to sell online.

## What's new in this version vs. the previous one

This is a full motion/layout rebuild in the style of editorial fashion
sites (Vogue/Calvin Klein), while keeping the same brand, palette, and
110-piece catalogue:

- **Custom cursor** (desktop only) — a small dot tracks the pointer
  exactly, a trailing ring eases behind it and expands into a "View"
  label over products. Automatically disabled on touch devices.
- **Kinetic type hero** — headline words animate in on load; the image
  collage reveals via a clip-path wipe.
- **Sticky-scroll lookbook** — a Vogue-style editorial section where a
  sticky image crossfades between pieces as you scroll past captions.
- **Scroll-triggered reveals** throughout, via IntersectionObserver.
- **Soft page transitions** between Home and Shop (a curtain wipes over
  before navigating). This only intercepts internal page links — external
  links, anchors, and JS-disabled visits all behave normally, by design.

## File map

```
index.html      Home — kinetic hero, sticky lookbook, editorial spread
shop.html       Full 110-piece catalogue — filter bar, staggered reveal grid
css/style.css   All styling
js/products.js  Catalogue data (60 dresses + 50 accessories)
js/plate.js     Placeholder product art (swap per note #1 above)
js/main.js      Nav, mobile menu, custom cursor, page transitions, scroll reveal, cart
js/shop.js      Shop filtering / search / sort / modal / reveal logic
```

## Testing note

Every interactive piece here (modal opens per card, filters, add-to-bag,
mobile menu, cursor tracking, lookbook sticky-sync, page transitions) was
verified with a headless browser driving real clicks and scroll events,
not just visually inspected — including two real bugs that were caught
and fixed this way (a masonry grid stretch that silently broke card
clicks, and overlapping placeholder text during the lookbook crossfade).
