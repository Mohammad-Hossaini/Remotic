import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  /* Primary Color */
  --color-primary: #087f5b;
  --color-primary-light: #218c6b;
  --color-primary-dark: #065a3f;

  /* Grey Scale */
  --color-grey-0: #fff;
  --color-grey-30: #f9fafb;
  --color-grey-50: #e6f2ef;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

  /* Status Colors */
  --color-success: #15803d;
  --color-warning: #a16207;
  --color-error: #b91c1c;
  --color-info: #0369a1;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 0.6rem 2.4rem rgba(0,0,0,0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0,0,0,0.12);

  /* Border Radius */
  --radius-xs: 3px;
  --radius-sm: 5px;
  --radius-md: 7px;
  --radius-lg: 9px;
  --radius-xl: 12px;
  --radius-xxl: 30px;

  /* Spacing System */
  --space-2: 0.2rem;
  --space-4: 0.4rem;
  --space-8: 0.8rem;
  --space-12: 1.2rem;
  --space-16: 1.6rem;
  --space-20: 2rem;
  --space-24: 2.4rem;
  --space-32: 3.2rem;
  --space-40: 4rem;
  --space-48: 4.8rem;
  --space-56: 5.6rem;
  --space-64: 6.4rem;

  /* Font Sizes (px → rem @10px base) */
  --font-xs: 1.024rem;   /* 10.24px */
  --font-sm: 1.28rem;    /* 12.8px */
  --font-base: 1.6rem;   /* 16px */
  --font-md: 2rem;       /* 20px */
  --font-lg: 2.5rem;     /* 25px */
  --font-xl: 3.125rem;   /* 31.25px */
  --font-2xl: 3.906rem;  /* 39.06px */
  --font-3xl: 4.883rem;  /* 48.83px */
  --font-4xl: 6.104rem;  /* 61.04px */

  /* Dark Mode Support */
  --background-color: #fff;
  --text-color: #555;
  --image-grayscale: 0;
  --image-opacity: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition: all 0.3s ease;
}

html {
  font-size: 62.5%; /* 1rem = 10px */
   scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  font-size: var(--font-base);
  line-height: 1.5;
  font-weight: 400;
  color: var(--text-color);
  background-color: var(--background-color);
  min-height: 100vh;
}



h1,h2,h3,h4,h5,h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-grey-900);
  overflow-wrap: break-word;
}

p {
  font-size: var(--font-base);
  color: var(--color-grey-700);
  line-height: 1.6;
  overflow-wrap: break-word;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}

button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

*:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

input:focus, button:focus, textarea:focus, select:focus {
  outline: 2px solid var(--color-primary-dark);
  outline-offset: -2px;
}

.container {
  max-width: 120rem;
  margin: 0 auto;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: var(--space-12) var(--space-32);
  font-size: var(--font-base);
  font-weight: 600;
  border-radius: var(--radius-lg);
  background-color: var(--color-primary);
  color: #fff;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: var(--color-primary-dark);
}

/* Utility Classes */
.text-center {
  text-align: center;
}

.mt-1 { margin-top: var(--space-8); }
.mt-2 { margin-top: var(--space-16); }
.mb-1 { margin-bottom: var(--space-8); }
.mb-2 { margin-bottom: var(--space-16); }

.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }

.hidden { display: none; }
.visible { display: block; }
`;

export default GlobalStyles;
