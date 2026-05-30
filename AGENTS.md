# AGENTS.md — MyDailyNeed

## Project Overview
Client-side only web application providing developer utility tools. 100% static, no backend, no data leaves the browser.

## Tech Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router v6 (hash-based for static hosting)
- **Styling:** Tailwind CSS only (`darkMode: 'class'`) — no CSS modules, styled-components, or inline styles
- **Icons:** FontAwesome (via @fortawesome/react-fontawesome)
- **OCR:** Tesseract.js v5 (WASM, loaded on-demand)
- **Testing:** Vitest + React Testing Library (80% minimum coverage)
- **Deployment:** GitHub Pages / Netlify / Vercel (static `dist/` folder)

## Architecture
- **One component per tool** — each tool in `src/tools/<category>/ToolName.jsx`
- **Tool registry** — all tools registered in `src/tools/registry.js`; never hardcode tool lists elsewhere
- **Lazy loading** — all tools use `React.lazy()` + `Suspense` for code splitting
- **Shared components** — `CopyButton`, `FileDropZone`, `ToolLayout`, `Sidebar`, `Header` in `src/components/`
- **Context providers** — `ThemeContext` in `src/context/` manages global theme state
- **Error boundaries** — wrap each tool to prevent one broken tool from crashing others

## Key Constraints
- No network requests from tools — all processing synchronous/local
- No environment variables or `.env` files
- No external fonts via Google Fonts — use system font stack or bundle locally
- Max OCR file size: 5MB (configurable constant)
- Initial bundle < 200KB gzipped (excluding Tesseract WASM)

## Developer Commands
```bash
npm install              # Install dependencies
npm run dev              # Start Vite dev server with HMR
npm run build            # Production build → outputs to dist/
npm run preview          # Preview production build locally
npm run test             # Run Vitest tests
npm run test:coverage    # Run tests with coverage report (80% min)
npm run test:ui          # Open Vitest UI dashboard
npm run lint             # Run ESLint (if configured)
```

## Testing Requirements
- **Minimum coverage:** 80% across all source files
- **Test files:** `ToolName.test.jsx` beside each component
- **Test framework:** Vitest + React Testing Library
- **Coverage thresholds:** Enforced in `vite.config.js`
- **Test priorities:**
  - Empty input
  - Invalid input
  - Very large input (>1MB for JSON, >5MB for images)
  - Unsupported file formats

## Conventions
- Tailwind utility classes only
- All inputs have `<label>`, all icon-only buttons have `aria-label`
- Errors shown inline — never `alert()` or `confirm()`
- Empty input handled gracefully — no crashes
- `localStorage` only for user preferences (theme), never user data
- **Dark mode:** All tools use consistent `dark:` variant patterns. See `docs/FOUNDATION.md` §6 for the full palette reference (labels, inputs, outputs, buttons, error/warning sections, stat cards, diff viewers).

## Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| `Cmd+K` / `Ctrl+K` | Open tool search |
| `Cmd+Enter` | Run/Process |
| `Cmd+Shift+C` | Copy output |
| `Escape` | Clear/close |

## Adding a New Tool
1. Create component in `src/tools/<category>/ToolName.jsx`
2. Add entry to `src/tools/registry.js` with: `id`, `name`, `description`, `category`, `icon`, `path`, `component`, `keywords`
3. Create tests in `src/tools/<category>/ToolName.test.jsx`
4. Sidebar, search, and routing auto-update from registry

## Documentation Structure
- `AGENTS.md` — This file (core instructions)
- `IMPLEMENTATION_PLAN.md` — Master roadmap with phases
- `docs/FOUNDATION.md` — Project setup, components, hooks, utils
- `docs/TOOLS_JSON.md` — JSON tools specs + tests
- `docs/TOOLS_XML.md` — XML tools specs + tests
- `docs/TOOLS_TEXT.md` — Text tools specs + tests
- `docs/TOOLS_IMAGE.md` — Image tools specs + tests
- `docs/TOOLS_MISC.md` — Misc tools specs + tests
