# Novel Editor

A modern, cross-platform novel writing and editing tool built with **Tauri**, **React**, and **Shadcn UI**.  
Supports Linux, Windows, and macOS, with persistent local storage and a rich-text editor powered by **Lexical**.

---

## Features

- 📝 Rich-text editing for novels, chapters, and notes
- 💾 Persistent local storage with **IndexedDB** (via **Dexie.js**)
- 📜 Visual logging system with console + database persistence
- 🚀 Fast, native-like experience using **Tauri**
- 🎨 Modern and responsive UI using **Shadcn UI** and **Tailwind CSS**
- ⚡ Multi-platform packaging: Linux (AppImage, DEB, RPM), Windows (MSI), macOS (DMG)

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI, Lexical
- **State & Data:** Dexie.js (IndexedDB), Consola logging
- **Routing & Queries:** @tanstack/react-router, @tanstack/react-query
- **Icons & UI Components:** Radix UI, Lucide React
- **Build & Packaging:** Tauri, Vite, TypeScript

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Bun (optional, used in scripts)
- Rust & Cargo (for Tauri)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Install Dependencies

```bash
bun install
# or
npm install
````

### Run in Development

```bash
bun run dev
# or
npm run dev
```

This will start the frontend on `http://localhost:1420` and Tauri in dev mode.

---

## Build

Build the frontend and bundle the Tauri app:

```bash
bun run build
# or
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Tauri Commands

Run Tauri dev:

```bash
npm run tauri dev
```

Build Tauri for production:

```bash
npm run tauri build
```

> ⚠ On Linux, ensure you have `patchelf`, `appimagetool` (or via AUR `appimagetool-bin`), `desktop-file-utils`, and `fuse2` installed to build AppImages.

---

## Scripts

| Script    | Description                        |
| --------- | ---------------------------------- |
| `dev`     | Start Vite dev server              |
| `build`   | Build frontend and Tauri app       |
| `preview` | Preview production build           |
| `tauri`   | Run Tauri CLI commands             |
| `format`  | Format code using Biome            |
| `lint`    | Lint project files using Biome     |
| `check`   | Type & lint checks using Biome     |
| `diff`    | Save git staged diff to `diff.txt` |

---

## Folder Structure

```
src/
├─ components/       # Reusable UI components (e.g., Button, Spinner)
├─ lib/              # Utilities, logger, Dexie DB
├─ routes/           # React Router routes
├─ styles.css        # Global CSS / Tailwind imports
src-tauri/           # Tauri Rust backend
```

---

## Logging

Uses **Consola** for colorful logs in console and also saves logs to **IndexedDB**.
View logs in-app via the `/log` route.


