/* Solenne Vane — placeholder plate art (self-contained, no third-party photo host).
   Swap window.SV_plate() call sites for real photography before full launch. */

(function () {
  "use strict";

  const PALETTES = [
    ["#4a0f16", "#0c0a08"], // garnet
    ["#3a2a12", "#0c0a08"], // brass-brown
    ["#241d13", "#0c0a08"], // olive-smoke
    ["#2b070c", "#0c0a08"], // deep oxblood
    ["#191410", "#0c0a08"], // graphite
    ["#33200d", "#0c0a08"], // copper-brown
  ];

  const DRESS_ICON =
    '<path d="M150,68 C133,68 120,80 120,98 C120,118 110,138 101,163 L74,326 C74,342 110,360 150,360 C190,360 226,342 226,326 L199,163 C190,138 180,118 180,98 C180,80 167,68 150,68 Z"/>' +
    '<path d="M120,98 C132,112 168,112 180,98" />';

  const ACCESSORY_ICON =
    '<path d="M100,175 q50,-72 100,0" />' +
    '<rect x="86" y="175" width="128" height="128" rx="14"/>' +
    '<circle cx="150" cy="208" r="5.5" fill="#c99566" stroke="none"/>';

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function svgWrap(inner) {
    return "data:image/svg+xml;utf8," + encodeURIComponent(inner);
  }

  function plate(product) {
    const [c1, c2] = PALETTES[hash(product.id) % PALETTES.length];
    const isDress = product.category === "Dresses";
    const icon = isDress ? DRESS_ICON : ACCESSORY_ICON;
    const letter = (product.name.trim()[0] || "S").toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        <defs>
          <radialGradient id="g" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </radialGradient>
          <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="35%" stop-color="#ffffff" stop-opacity="0"/>
            <stop offset="48%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#g)"/>
        <rect width="300" height="400" fill="url(#sheen)"/>
        <rect x="7" y="7" width="286" height="386" fill="none" stroke="rgba(201,149,102,0.3)" stroke-width="1"/>
        <text x="150" y="270" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
              font-size="230" fill="rgba(201,149,102,0.09)" text-anchor="middle">${letter}</text>
        <g fill="none" stroke="#c99566" stroke-width="2" opacity="0.88" transform="translate(0,-6)">${icon}</g>
      </svg>`;
    return svgWrap(svg);
  }

  function crest(label1, label2) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 860">
        <defs>
          <radialGradient id="cg" cx="50%" cy="36%" r="75%">
            <stop offset="0%" stop-color="#2b1610"/>
            <stop offset="100%" stop-color="#0c0a08"/>
          </radialGradient>
        </defs>
        <rect width="700" height="860" fill="url(#cg)"/>
        <circle cx="350" cy="400" r="150" fill="none" stroke="rgba(201,149,102,0.5)" stroke-width="1.5"/>
        <circle cx="350" cy="400" r="128" fill="none" stroke="rgba(201,149,102,0.28)" stroke-width="1"/>
        <text x="350" y="418" font-family="Georgia, serif" font-style="italic" font-size="60"
              fill="#c99566" text-anchor="middle">SV</text>
        <text x="350" y="600" font-family="Georgia, serif" font-size="16" letter-spacing="3"
              fill="rgba(239,230,216,0.55)" text-anchor="middle">${label1 || ""}</text>
        <text x="350" y="628" font-family="Georgia, serif" font-size="13" letter-spacing="2"
              fill="rgba(239,230,216,0.35)" text-anchor="middle">${label2 || ""}</text>
      </svg>`;
    return svgWrap(svg);
  }

  function favicon() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect width="64" height="64" fill="#0c0a08"/>
        <circle cx="32" cy="32" r="26" fill="none" stroke="#c99566" stroke-width="2"/>
        <text x="32" y="41" font-family="Georgia, serif" font-style="italic" font-size="24"
              fill="#c99566" text-anchor="middle">SV</text>
      </svg>`;
    return svgWrap(svg);
  }

  window.SV_plate = plate;
  window.SV_crest = crest;
  window.SV_favicon = favicon;
})();
