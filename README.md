# Foodie Map

Hitta halal-certifierade och kostanpassade restauranger i Stockholm.

## Prerequisites

- Node.js (v22 or higher recommended)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shemaakamal00/Foodie-map.git
cd Foodie-map
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browser (for E2E tests)

```bash
npx playwright install chromium
```

### 4. Run the development server

```bash
npx vite
```

Open `http://localhost:5173/startsida.html` in your browser.

> **IMPORTANT:** Do NOT use VS Code Live Server! It won't work with TypeScript files. Always use `npx vite` to run the project.

## Project Structure

```
├── startsida.html          # Home page
├── restaurangsida.html     # Restaurant page
├── kartsida.html           # Map page
├── favoritsida.html        # Favorites page
├── tipssida.html           # Tips page
│
├── src/
│   ├── components/
│   │   ├── nav.ts          # Shared navigation (auto-injected)
│   │   └── footer.ts       # Shared footer (auto-injected)
│   ├── css/
│   │   ├── style.css       # Global styles + CSS variables
│   │   ├── nav.css         # Navigation styles
│   │   └── footer.css      # Footer styles
│   ├── pages/              # Page-specific TypeScript (create your own)
│   ├── main.ts             # Entry point - imports nav/footer
│   ├── supabase.ts         # Supabase API wrapper
│   ├── database.ts         # Supabase credentials
│   └── vite-env.d.ts       # TypeScript declarations
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
```

## For Colleagues

### Adding nav & footer to your page

Every HTML page just needs this at the bottom of `<body>`:

```html
<script type="module" src="/src/main.ts"></script>
```

The navigation and footer will render automatically.

### Creating page-specific logic

Create your own TypeScript file in `src/pages/`, for example:

```
src/pages/favoritsida.ts
```

Then import it in your HTML:

```html
<script type="module" src="/src/pages/favoritsida.ts"></script>
```

### Using Supabase

Import the wrapper functions:

```typescript
import { fromTable, fromTableFiltered } from "./supabase.ts";

// Fetch all from a table
const restaurants = await fromTable("restaurant", "id,name,address");

// Fetch with filter
const halal = await fromTableFiltered("restaurant", { name: "ilike.*kebab*" });
```

## Available Scripts

| Command            | Description                 |
| ------------------ | --------------------------- |
| `npx vite`         | Start development server    |
| `npm test`         | Run all tests with coverage |
| `npm run test:e2e` | Run E2E tests only          |
| `npm run lint`     | Lint source files           |

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **Leaflet** - Map library (via CDN)
- **Supabase** - Database (REST API)

## CSS Variables

Use these in your styles:

```css
var(--color-primary)      /* #3E5A5B - nav/footer */
var(--color-background)   /* #f5f5f5 - page background */
var(--color-surface)      /* #ffffff - cards */
var(--color-text)         /* #333333 - text */
var(--border-radius)      /* 8px */
```

Diet tags:

```css
var(--color-tag-halal)     /* green */
var(--color-tag-vegan)     /* light green */
var(--color-tag-glutenfree) /* orange */
var(--color-tag-kosher)    /* purple */
```
