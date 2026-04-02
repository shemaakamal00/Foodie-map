# Foodie Map

A web application for discovering food locations for special diet .

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

### 3. Install Playwright browser

```bash
npx playwright install chromium
```

## Project Structure

```
project/
├── src/
│   └── css/
│       └── style.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── index.html
├── eslint.config.mjs
├── vitest.config.js
├── playwright.config.js
└── package.json
```

## Available Scripts

| Command            | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `npm test`         | Run all tests (unit + integration + e2e) with coverage |
| `npm run test:e2e` | Run end-to-end tests only                              |
| `npm run lint`     | Lint source files                                      |
| `npm run preview`  | Preview built application                              |

## Testing

- **Unit tests**: Located in `tests/unit/` - test individual functions
- **Integration tests**: Located in `tests/integration/` - test component interactions
- **E2E tests**: Located in `tests/e2e/` - test full user flows with Playwright

## Tech Stack

- **Vite** - Build tool and dev server
- **Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
