// src/styles/theme.js
// JS-side mirror of theme.css, used only where a colour needs to be computed
// at runtime (e.g. a plant's accent colour, injected as a CSS variable).
// Static styling always lives in CSS — never reach for this object to
// build inline `style` props for things a class name could do.

export const theme = {
  colors: {
    earth: '#1c110a',
    forestDeep: '#1b3a2d',
    leaf: '#3a7352',
    leafPale: '#d8e9d6',
    gold: '#b8860b',
    terracotta: '#a44c3c',
    sky: '#fbf9f6',
    cloud: '#f0ebe3',
    clay: '#b7a89b',
    danger: '#b53a2e',
    warning: '#e09e3a',
    safe: '#2f855a',
  },
};

export default theme;
