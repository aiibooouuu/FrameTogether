/**
 * ==========================================================
 * FrameTogether
 * Camera Filter Presets
 * ==========================================================
 *
 * Single source of truth for every camera look.
 *
 * Each preset contains:
 * - id
 * - label
 * - category
 * - css
 * - canvas
 * - gradient
 * - preview
 * - icon
 * - featured
 *
 * ==========================================================
 */

export const FILTERS = {
  natural: {
    id: "natural",
    label: "Natural",
    category: "Film",

    css: "none",
    canvas: "none",

    gradient:
      "linear-gradient(135deg,#efe6ca 0%,#d9cfaa 100%)",

    preview: "#d9cfaa",

    icon: "film",

    featured: true,
  },

  kodakgold: {
    id: "kodakgold",
    label: "Kodak Gold",
    category: "Film",

    css:
      "brightness(1.05) contrast(1.08) saturate(1.28) sepia(.18)",

    canvas:
      "brightness(1.05) contrast(1.08) saturate(1.28) sepia(.18)",

    gradient:
      "linear-gradient(135deg,#d9a048 0%,#f0d17b 100%)",

    preview: "#d9a048",

    icon: "film",

    featured: true,
  },

  fujiclassic: {
    id: "fujiclassic",
    label: "Fuji Classic",
    category: "Film",

    css:
      "contrast(1.05) saturate(.92) brightness(1.03)",

    canvas:
      "contrast(1.05) saturate(.92) brightness(1.03)",

    gradient:
      "linear-gradient(135deg,#9fc48e 0%,#bfd3ad 100%)",

    preview: "#9fc48e",

    icon: "film",

    featured: true,
  },

  portra400: {
    id: "portra400",
    label: "Portra 400",
    category: "Film",

    css:
      "brightness(1.04) contrast(.96) saturate(.94) sepia(.12)",

    canvas:
      "brightness(1.04) contrast(.96) saturate(.94) sepia(.12)",

    gradient:
      "linear-gradient(135deg,#e0b98a 0%,#cfa070 100%)",

    preview: "#cfa070",

    icon: "film",

    featured: false,
  },

  vintage: {
    id: "vintage",
    label: "Vintage",
    category: "Film",

    css:
      "sepia(1) contrast(.95) brightness(1.04) saturate(.85)",

    canvas:
      "sepia(1) contrast(.95) brightness(1.04) saturate(.85)",

    gradient:
      "linear-gradient(135deg,#d6bc7c 0%,#b58f4d 100%)",

    preview: "#b58f4d",

    icon: "film",

    featured: false,
  },

  softglow: {
    id: "softglow",
    label: "Soft Glow",
    category: "Creative",

    css:
      "brightness(1.08) contrast(.9) saturate(1.18)",

    canvas:
      "brightness(1.08) contrast(.9) saturate(1.18)",

    gradient:
      "linear-gradient(135deg,#efd0c6 0%,#f4e5dc 100%)",

    preview: "#efd0c6",

    icon: "sparkles",

    featured: true,
  },

  cinema: {
    id: "cinema",
    label: "Cinema",
    category: "Creative",

    css:
      "contrast(1.2) brightness(.95) saturate(.85)",

    canvas:
      "contrast(1.2) brightness(.95) saturate(.85)",

    gradient:
      "linear-gradient(135deg,#4d4d4d 0%,#222222 100%)",

    preview: "#4a4a4a",

    icon: "clapperboard",

    featured: true,
  },

monochrome: {
    id: "monochrome",
    label: "Monochrome",
    category: "Creative",

    css:
        "grayscale(1) contrast(1.15) brightness(1.02)",

    canvas:
        "grayscale(1) contrast(1.15) brightness(1.02)",

    gradient:
        "linear-gradient(135deg,#b0b0b0 0%,#666666 100%)",

    preview: "#808080",

    icon: "circle",

    featured: false,
},

coolblue: {
    id: "coolblue",
    label: "Cool Blue",
    category: "Creative",

    css:
        "hue-rotate(175deg) saturate(1) contrast(1.02) brightness(1.01)",

    canvas:
        "hue-rotate(175deg) saturate(1) contrast(1.02) brightness(1.01)",

    gradient:
        "linear-gradient(135deg,#9eb7d8 0%,#6f8fb8 100%)",

    preview: "#6f8fb8",

    icon: "droplet",

    featured: false,
},
};

/* ========================================================== */
/* Helpers */
/* ========================================================== */

export function getFilter(filterKey) {
    return FILTERS[filterKey] ?? FILTERS.natural;
}

export function getFilterKeys() {
    return Object.keys(FILTERS);
}

export function getFilterLabels() {
    return Object.entries(FILTERS).map(([key, preset]) => ({
        key,
        label: preset.label,
        category: preset.category,
        gradient: preset.gradient,
        preview: preset.preview,
        icon: preset.icon,
        featured: preset.featured,
    }));
}

export function getFiltersByCategory() {
    return Object.entries(FILTERS).reduce((groups, [key, preset]) => {
        const category = preset.category ?? "Other";

    if (!groups[category]) {
        groups[category] = [];
    }

    groups[category].push({
        key,
        ...preset,
    });

        return groups;
    }, {});
}

export function getCategories() {
    return [...new Set(Object.values(FILTERS).map(filter => filter.category))];
}

export function getFeaturedFilters() {
    return Object.entries(FILTERS)
        .filter(([, preset]) => preset.featured)
        .map(([key, preset]) => ({
            key,
            ...preset,
        }));
}