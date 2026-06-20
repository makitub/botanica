// src/utils/color.js
// ────────────────────────────────────────────────────────────────────────
// Small, dependency-free colour helpers. The plant catalogue assigns each
// plant an arbitrary hex colour for visual identity, but those hexes vary
// wildly in saturation and lightness (some are pale pastels, some are
// near-black) — used as-is, that makes some plants nearly invisible.
//
// `plantGradient` keeps each plant's distinct hue (its identity) but
// normalises saturation/lightness so every plant gets the same vivid,
// "alive" two-tone treatment: a bright, vivid centre and a deep, solid
// edge — like light through a leaf.
// ────────────────────────────────────────────────────────────────────────

function hexToHsl(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      default: h = ((r - g) / d + 4) * 60;
    }
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Returns a vivid { light, dark } pair sharing the input hex's hue.
 * `light` is meant for an inner/centre fill, `dark` for an outer edge —
 * the same hue at two consistent, always-visible intensities.
 */
export function plantGradient(hex) {
  const { h } = hexToHsl(hex);
  return {
    light: `hsl(${h}, 75%, 64%)`,
    dark: `hsl(${h}, 68%, 30%)`,
  };
}
