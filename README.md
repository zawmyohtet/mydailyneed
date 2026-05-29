# MyDailyNeed

[![CI](https://github.com/anomalyco/mydailyneed/actions/workflows/ci.yml/badge.svg)](https://github.com/anomalyco/mydailyneed/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/anomalyco/mydailyneed/branch/main/graph/badge.svg)](https://codecov.io/gh/anomalyco/mydailyneed)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel)](https://mydailyneed.vercel.app)

> A collection of lightweight, privacy-first developer utility tools that run entirely in your browser. No data is ever sent to a server — everything happens client-side.

---

## Tools

| Category | Tool | Description |
| -------- | ---- | ----------- |
| **JSON** | JSON Formatter | Prettify and validate JSON with syntax highlighting |
| | JSON Minifier | Remove whitespace from JSON for compact output |
| | JSON ↔ YAML Converter | Convert between JSON and YAML formats |
| **XML** | XML Formatter | Prettify and validate XML with proper indentation |
| | XML Minifier | Strip whitespace from XML for compact output |
| **Text** | Base64 Encoder/Decoder | Encode text to Base64 or decode Base64 back to text |
| | URL Encoder/Decoder | Encode URLs for safe transmission or decode encoded URLs |
| | Word Counter | Count words, characters, sentences, paragraphs and more |
| | Case Converter | Convert text between uppercase, lowercase, camelCase, snake_case and more |
| **Image** | Image to Text (OCR) | Extract text from images using Tesseract.js |
| **Misc** | Timestamp Converter | Convert between Unix timestamps and human-readable dates |
| | UUID Generator | Generate random UUID v4 identifiers |
| | Color Converter | Convert colors between HEX, RGB and HSL formats |
| | Regex Tester | Test and validate regular expressions with live matching |
| | JWT Decoder | Decode JSON Web Tokens to view header and payload |

---

## Features

- **100% client-side** — all processing happens in your browser, nothing is uploaded
- **Dark mode** — toggle between light and dark themes with persistent preference
- **Keyboard shortcuts** — quick access to search, run, copy and clear actions
- **Tool search** — press `Cmd+K` to quickly find and navigate to any tool
- **Copy to clipboard** — one-click copy for all tool outputs
- **Responsive** — works on desktop and mobile

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vitejs.dev/) | Build tool and dev server |
| [React Router 7](https://reactrouter.com/) | Client-side routing (hash-based) |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling |
| [Font Awesome 7](https://fontawesome.com/) | Icon library |
| [Tesseract.js](https://tesseract.projectnaptha.com/) | OCR engine for image-to-text |
| [Vitest 4](https://vitest.dev/) | Unit testing framework |
| [js-yaml](https://github.com/nodeca/js-yaml) | YAML parsing/serialization |

## Getting Started

**Prerequisites:** Node.js >= 26.1.0

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Run tests with Vitest UI dashboard |
| `npm run lint` | Lint source files with ESLint |

## Keyboard Shortcuts

| Shortcut | Action |
| -------- | ------ |
| `Cmd/Ctrl + K` | Open tool search |
| `Cmd/Ctrl + Enter` | Run/process current tool |
| `Cmd/Ctrl + Shift + C` | Copy output to clipboard |
| `Escape` | Clear input / close dialogs |

## Project Structure

```
src/
├── App.jsx                  # Main app with routing
├── main.jsx                 # Entry point
├── index.css                # Tailwind imports + global styles
├── components/              # Shared UI components
│   ├── CopyButton.jsx
│   ├── FileDropZone.jsx
│   ├── Header.jsx
│   ├── KeyboardShortcutsModal.jsx
│   ├── Sidebar.jsx
│   ├── ToolLayout.jsx
│   └── ToolSearch.jsx
├── hooks/                   # Custom React hooks
│   ├── useKeyboardShortcuts.js
│   └── useLocalStorage.js
├── tools/                   # Individual tool implementations
│   ├── registry.js          # Tool definitions and lazy-loaded routes
│   ├── json/
│   ├── xml/
│   ├── text/
│   ├── image/
│   └── misc/
└── utils/                   # Utility functions and tests
    ├── color.js
    ├── downloadText.js
    ├── fileValidation.js
    ├── formatJson.js
    ├── formatXml.js
    ├── misc.js
    ├── ocr.js
    ├── textTransforms.js
    ├── timestamp.js
    └── uuid.js
```

## Deployment

The project is pre-configured for [Vercel](https://vercel.com/):

```bash
vercel --prod
```

A `vercel.json` is included with:
- Vite framework preset
- Security headers (CSP, X-Frame-Options, etc.)
- Output directory set to `dist/`

## CI/CD

GitHub Actions runs on every push and pull request to `main`:

- **Test job** — installs dependencies, runs tests with coverage, uploads to Codecov
- **Build job** — builds the production bundle and verifies the output

A `CODECOV_TOKEN` secret must be configured in the repository settings.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

All PRs must pass linting and tests. Coverage thresholds are enforced at 80%.

## License

MIT
