/* Solenne Vane — shop catalogue behaviour */

(function () {
  "use strict";

  const PRODUCTS = window.SV_PRODUCTS || [];
  const PAGE_SIZE = 24;

  const state = { category: "All", subcategory: "All", query: "", sort: "featured", shown: PAGE_SIZE };

  const grid = document.getElementById("product-grid");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const loadMoreBtn = document.getElementById("load-more");
  const searchField = document.getElementById("search-field");
  const sortSelect = document.getElementById("sort-select");
  const catRow = document.getElementById("category-filters");
  const subRow = document.getElementById("subcategory-filters");

  function money(n) { return "€" + n.toLocaleString("en-IE"); }

  function subcategoriesFor(category) {
    const set = new Set();
    PRODUCTS.forEach((p) => { if (category === "All" || p.category === category) set.add(p.subcategory); });
    return Array.from(set).sort();
  }

  function buildCategoryChips() {
    const cats = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
    catRow.innerHTML = cats.map((c) =>
      `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${c}">${c}</button>`
    ).join("");
  }
  function buildSubChips() {
    const subs = ["All", ...subcategoriesFor(state.category)];
    subRow.innerHTML = subs.map((s) =>
      `<button class="chip ${s === state.subcategory ? "active" : ""}" data-sub="${s}">${s}</button>`
    ).join("");
  }

  function filtered() {
    let list = PRODUCTS.filter((p) => {
      if (state.category !== "All" && p.category !== state.category) return false;
      if (state.subcategory !== "All" && p.subcategory !== state.subcategory) return false;
      if (state.query) {
        const q = state.query.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.material.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (state.sort === "price-asc") list = list.slice().sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") list = list.slice().sort((a, b) => b.price - a.price);
    if (state.sort === "name") list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  function cardHTML(p, i) {
    const delay = Math.min(i, 11) * 45;
    return `
      <article class="product-card rs-item" style="transition-delay:${delay}ms" data-id="${p.id}" tabindex="0">
        <div class="pimg-wrap">
          <img loading="lazy" src="${window.SV_plate(p)}" alt="${p.name}">
        </div>
        <div class="pinfo">
          <div>
            <h4>${p.name}</h4>
            <div class="pmeta">${p.material} · ${p.id}</div>
            <div class="quick-add" data-add="${p.id}">Add to bag</div>
          </div>
          <div class="pprice">${money(p.price)}</div>
        </div>
      </article>`;
  }

  function render() {
    const list = filtered();
    const toShow = list.slice(0, state.shown);
    grid.classList.remove("visible");
    grid.classList.add("reveal-stagger");
    grid.innerHTML = toShow.map(cardHTML).join("");
    resultsCount.textContent = `${list.length} piece${list.length === 1 ? "" : "s"}`;
    emptyState.classList.toggle("show", list.length === 0);
    loadMoreBtn.style.display = list.length > state.shown ? "inline-flex" : "none";
    attachCardHandlers();
    requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add("visible")));
  }

  function attachCardHandlers() {
    grid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-add]")) {
          e.stopPropagation();
          addToBag(e.target.closest("[data-add]").dataset.add);
          return;
        }
        openModal(card.dataset.id);
      });
      card.addEventListener("keypress", (e) => { if (e.key === "Enter") openModal(card.dataset.id); });
    });
  }

  function addToBag(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    window.SV_Cart.add(id);
    window.SV_toast(`${p.name} added to your bag.`);
  }

  const backdrop = document.getElementById("modal-backdrop");
  const modalMedia = document.getElementById("modal-media");
  const modalInfo = document.getElementById("modal-info");

  function openModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    modalMedia.innerHTML = `<img src="${window.SV_plate(p)}" alt="${p.name}">`;
    modalInfo.innerHTML = `
      <button class="modal-close" aria-label="Close">&times;</button>
      <span class="eyebrow">${p.category} — ${p.subcategory}</span>
      <h3>${p.name}</h3>
      <span class="mprice">${money(p.price)}</span>
      <p>${p.blurb} Made to order in the house's workroom; allow three weeks for delivery.</p>
      <button class="btn solid" data-add="${p.id}">Add to bag</button>
      <span class="ref">Reference ${p.id}</span>
    `;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    modalInfo.querySelector(".modal-close").addEventListener("click", closeModal);
    modalInfo.querySelector("[data-add]").addEventListener("click", () => addToBag(p.id));
  }
  function closeModal() { backdrop.classList.remove("open"); document.body.style.overflow = ""; }
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  catRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat; state.subcategory = "All"; state.shown = PAGE_SIZE;
    buildCategoryChips(); buildSubChips(); render();
  });
  subRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sub]");
    if (!btn) return;
    state.subcategory = btn.dataset.sub; state.shown = PAGE_SIZE;
    buildSubChips(); render();
  });
  let searchDebounce;
  searchField.addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => { state.query = e.target.value.trim(); state.shown = PAGE_SIZE; render(); }, 180);
  });
  sortSelect.addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  loadMoreBtn.addEventListener("click", () => { state.shown += PAGE_SIZE; render(); });

  buildCategoryChips();
  buildSubChips();
  render();
})();
