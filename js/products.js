/* Solenne Vane — catalog data (110 pieces, deterministically generated) */

(function () {
  const DRESS_ADJ = [
    "Garnet", "Vellum", "Dusk", "Brasswork", "Oxblood", "Parchment",
    "Nocturn", "Scarlet", "Umbral", "Verdigris", "Alabaster", "Tallow",
    "Rouge", "Cinder", "Mourning", "Antique", "Filigreed", "Draped",
    "Hollow", "Vane",
  ];
  const DRESS_NOUN = [
    "Column Gown", "Wrap Dress", "Cape Dress", "Bias Gown", "Halter Gown",
    "Tailored Coat Dress", "Draped Gown", "Corseted Dress", "Sheath Dress",
    "Opera Gown", "Cocktail Dress", "Trench Dress", "Velvet Robe Dress",
    "Slip Dress", "Godet Gown",
  ];
  const DRESS_MATERIAL = [
    "garnet velvet", "brass-thread jacquard", "oxblood taffeta",
    "aged tulle", "duchesse satin", "black mohair", "claret chiffon",
    "wool crêpe", "copper lamé", "shadow silk faille", "burnt organza",
    "tarnished satin",
  ];

  const ACC_ADJ = [
    "Vane", "Solenne", "Rivoux", "Ashgrove", "Marchant", "Delvane",
    "Corbeau", "Ferro", "Aubrienne", "Castellane", "Thorn", "Wrenlow",
    "Duvane", "Ilette", "Marrow",
  ];
  const ACC_NOUN = [
    "Clutch", "Structured Tote", "Leather Gloves", "Silk Foulard", "Belt",
    "Brooch", "Cuff Bracelet", "Drop Earrings", "Evening Bag", "Card Case",
    "Choker", "Hair Comb", "Opera Bag", "Signet Ring", "Cravat Pin",
  ];
  const ACC_MATERIAL = [
    "brushed brass", "aged garnet leather", "oxidized copper",
    "smoked pewter", "waxed hide", "antique brass", "black enamel",
    "burnished bronze", "hand-tooled leather", "dark vermeil",
    "patinated steel",
  ];

  function money(base, step) {
    return Math.round((base + step) / 5) * 5 - 1;
  }

  function buildDresses(count) {
    const items = [];
    for (let i = 0; i < count; i++) {
      const adj = DRESS_ADJ[i % DRESS_ADJ.length];
      const noun = DRESS_NOUN[(i * 7) % DRESS_NOUN.length];
      const material = DRESS_MATERIAL[(i * 5) % DRESS_MATERIAL.length];
      items.push({
        id: "SV-D" + String(100 + i),
        name: `${adj} ${noun}`,
        category: "Dresses",
        subcategory: noun.includes("Gown") ? "Gowns" : "Dresses",
        material: material,
        price: money(440, (i * 37) % 900),
        blurb: `Cut in ${material}, finished by hand with a brass-thread hem.`,
      });
    }
    return items;
  }

  function buildAccessories(count) {
    const items = [];
    for (let i = 0; i < count; i++) {
      const adj = ACC_ADJ[i % ACC_ADJ.length];
      const noun = ACC_NOUN[(i * 4) % ACC_NOUN.length];
      const material = ACC_MATERIAL[(i * 3) % ACC_MATERIAL.length];
      items.push({
        id: "SV-A" + String(200 + i),
        name: `${adj} ${noun}`,
        category: "Accessories",
        subcategory: noun,
        material: material,
        price: money(170, (i * 29) % 620),
        blurb: `Worked in ${material}, aged by hand for a lived-in shine.`,
      });
    }
    return items;
  }

  window.SV_PRODUCTS = [...buildDresses(60), ...buildAccessories(50)];
})();
