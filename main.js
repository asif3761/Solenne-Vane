/* Solenne Vane — shared site behaviour */

(function () {
  "use strict";

  /* ---------- cart (persisted, visual only) ---------- */
  const Cart = {
    key: "sv_bag",
    read() {
      try { return JSON.parse(localStorage.getItem(this.key)) || []; }
      catch (e) { return []; }
    },
    write(items) {
      localStorage.setItem(this.key, JSON.stringify(items));
      this.renderCount();
    },
    add(id) {
      const items = this.read();
      items.push(id);
      this.write(items);
    },
    renderCount() {
      const n = this.read().length;
      document.querySelectorAll("[data-bag-count]").forEach((el) => { el.textContent = n; });
    },
  };
  window.SV_Cart = Cart;

  document.addEventListener("DOMContentLoaded", () => {
    Cart.renderCount();
    initFavicon();
    initNav();
    initMobileNav();
    initToast();
    initSpotlight();
    initHelix();
    initFooterForm();
  });

  /* ---------- favicon ---------- */
  function initFavicon() {
    if (!window.SV_favicon || document.querySelector('link[rel="icon"]')) return;
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = window.SV_favicon();
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

  /* ---------- cursor spotlight (the hero "touch" effect) ---------- */
  function initSpotlight() {
    const hero = document.querySelector(".hero");
    const glow = document.querySelector(".hero-spotlight");
    if (!hero || !glow) return;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      glow.style.setProperty("--sx", x + "%");
      glow.style.setProperty("--sy", y + "%");
    });
  }

  /* ---------- vertical helix ----------
     Three tiers of items spiral around a vertical axis, each tier turning
     at a slightly different speed and bobbing gently on its own sine wave —
     a chandelier of garments rather than a flat orbit ring. */
  function initHelix() {
    const stage = document.querySelector(".helix-stage");
    const anchor = document.querySelector(".helix-anchor");
    if (!stage || !anchor) return;

    const tiers = Array.from(anchor.querySelectorAll(".helix-tier"));
    if (!tiers.length) return;

    if (window.SV_PRODUCTS && window.SV_plate) {
      const picks = [3, 55, 21, 88, 40, 100, 12, 65, 30];
      let idx = 0;
      tiers.forEach((tier) => {
        tier.querySelectorAll(".helix-item").forEach((item) => {
          const p = window.SV_PRODUCTS[picks[idx % picks.length]];
          idx++;
          if (!p) return;
          const img = item.querySelector("img");
          const cap = item.querySelector("figcaption");
          if (img) { img.src = window.SV_plate(p); img.alt = p.name; }
          if (cap) cap.textContent = p.name;
        });
      });
    }

    const radius = Math.min(stage.clientWidth, 340) * 0.42;
    let t = 0;
    let speed = 0.0028;
    let targetSpeed = speed;

    stage.addEventListener("pointerenter", () => { targetSpeed = 0.001; });
    stage.addEventListener("pointerleave", () => { targetSpeed = 0.0028; });

    function frame() {
      t += 1;
      speed += (targetSpeed - speed) * 0.03;

      tiers.forEach((tier, ti) => {
        const dir = ti % 2 === 0 ? 1 : -1;
        const tierSpeed = speed * (1 + ti * 0.18) * dir;
        const angleBase = t * tierSpeed;
        const bob = Math.sin(t * 0.01 + ti) * 6;
        const items = tier.querySelectorAll(".helix-item");
        const n = items.length;
        items.forEach((item, i) => {
          const a = angleBase + (i / n) * Math.PI * 2;
          const x = Math.cos(a) * radius;
          const depth = Math.sin(a);
          const scale = 0.68 + (depth + 1) / 2 * 0.42;
          const opacity = 0.4 + (depth + 1) / 2 * 0.6;
          const z = Math.round(depth * 100);
          item.style.transform = `translate(-50%, 0) translate(${x}px, ${bob}px) scale(${scale})`;
          item.style.opacity = opacity.toFixed(2);
          item.style.zIndex = 100 + z;
        });
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
