/* Solenne Vane — editorial motion behaviour */

(function () {
  "use strict";

  let FINE_POINTER = false;
  try { FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches; }
  catch (e) { FINE_POINTER = false; }

  /* ---------- cart (persisted, visual only) ---------- */
  const Cart = {
    key: "sv_bag",
    read() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
    write(items) { try { localStorage.setItem(this.key, JSON.stringify(items)); } catch (e) { /* storage unavailable — cart stays in-memory for this view */ } this.renderCount(); },
    add(id) { const items = this.read(); items.push(id); this.write(items); },
    renderCount() {
      try {
        const n = this.read().length;
        document.querySelectorAll("[data-bag-count]").forEach((el) => { el.textContent = n; });
      } catch (e) { /* non-critical */ }
    },
  };
  window.SV_Cart = Cart;

  document.addEventListener("DOMContentLoaded", () => {
    // Reveal runs first and is the most important for basic visibility —
    // if anything below throws, page content must never stay invisible.
    safe(initReveal);
    safe(() => Cart.renderCount());
    safe(initFavicon);
    safe(initNav);
    safe(initMobileNav);
    safe(initToast);
    safe(initCursor);
    safe(initPageTransitions);
    safe(initLookbook);
    safe(initFooterForm);
  });

  function safe(fn) {
    try { fn(); } catch (e) { console.warn("Solenne Vane: a non-critical feature failed to start —", e); }
  }

  /* ---------- favicon ---------- */
  function initFavicon() {
    if (!window.SV_favicon || document.querySelector('link[rel="icon"]')) return;
    const link = document.createElement("link");
    link.rel = "icon"; link.type = "image/svg+xml"; link.href = window.SV_favicon();
    document.head.appendChild(link);
  }

  /* ---------- nav ---------- */
  function initNav() {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  function initMobileNav() {
    const nav = document.querySelector(".site-nav");
    const linkGroups = document.querySelectorAll(".nav-links");
    if (!nav || !linkGroups.length) return;

    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    nav.appendChild(toggle);

    const allLinks = [];
    linkGroups.forEach((g) => allLinks.push(g.innerHTML));
    const panel = document.createElement("div");
    panel.className = "mobile-nav";
    panel.innerHTML = allLinks.join("");
    document.body.appendChild(panel);

    function setOpen(open) {
      panel.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
    panel.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 640) setOpen(false); });
  }

  /* ---------- toast ---------- */
  function initToast() {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
    window.SV_toast = (msg) => {
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(window.__sv_toast_t);
      window.__sv_toast_t = setTimeout(() => toast.classList.remove("show"), 2200);
    };
  }

  /* ---------- custom cursor ----------
     A small dot tracks the pointer exactly; a ring trails it with easing
     and expands into a "View" label over products, or a soft glow over
     links and buttons. Desktop fine-pointer only — untouched on mobile. */
  function initCursor() {
    if (!FINE_POINTER) return;
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(dot, ring);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let active = false;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!active) { active = true; document.documentElement.classList.add("cursor-ready"); }
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function frame() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    document.addEventListener("mouseover", (e) => {
      const viewTarget = e.target.closest(".product-card, .collage-item, .spread-hero, .spread-row");
      const growTarget = e.target.closest("a, button, .chip");
      ring.classList.toggle("view", !!viewTarget);
      ring.classList.toggle("grow", !!growTarget && !viewTarget);
    });
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) { ring.classList.remove("view", "grow"); }
    });
  }

  /* ---------- page transitions ----------
     Only intercepts links to a different local .html page. Anchors, the
     current page, and external links behave exactly as normal — the
     overlay starts off-screen, so nothing depends on this running. */
  function initPageTransitions() {
    const overlay = document.createElement("div");
    overlay.className = "page-transition";
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href$=".html"]').forEach((a) => {
      const href = a.getAttribute("href");
      const here = location.pathname.split("/").pop() || "index.html";
      if (href === here) return;
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        overlay.classList.add("leave");
        setTimeout(() => { location.href = href; }, 620);
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (!targets.length) return;

    let observing = false;
    try {
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
        targets.forEach((t) => io.observe(t));
        observing = true;
      }
    } catch (e) { observing = false; }

    if (!observing) {
      // IntersectionObserver missing or blocked — reveal immediately
      // rather than leaving content permanently invisible.
      targets.forEach((t) => t.classList.add("visible"));
      return;
    }

    // Fail-safe: even if observing started fine, a restricted preview
    // frame (odd iframe sizing, no real scroll container) might never
    // actually fire a callback. Force reveal anything still hidden.
    setTimeout(() => {
      document.querySelectorAll(".reveal:not(.visible), .reveal-stagger:not(.visible)")
        .forEach((t) => t.classList.add("visible"));
    }, 2000);
  }

  /* ---------- lookbook: sticky image follows the caption in view ---------- */
  function initLookbook() {
    const media = document.querySelector(".lookbook-media");
    const captions = document.querySelectorAll(".lookbook-caption");
    if (!media || !captions.length || !("IntersectionObserver" in window)) return;
    const images = media.querySelectorAll("img");

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.index || 0);
          images.forEach((img, i) => img.classList.toggle("active", i === idx));
        }
      });
    }, { threshold: 0.55 });
    captions.forEach((c) => io.observe(c));
  }

  /* ---------- footer newsletter ---------- */
  function initFooterForm() {
    const form = document.querySelector(".footer-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (input && input.value.trim()) {
        window.SV_toast && window.SV_toast("You're on the list.");
        input.value = "";
      }
    });
  }
})();
