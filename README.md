# Andrian Leah

**Lead UI Developer at [On Page](https://www.onpage.it)**
Building for the web since 2018. Working full remote from Rimini, Italy.

I lead the user interface of On Page, a SaaS PIM (product information management) platform. In a four-person R&D team, I am the only one responsible for the UI: from gathering requirements and UX analysis to design and implementation. I rewrote the product's front end on a design system I created, and I designed the AI-assisted workflow the company now uses to build and evolve its UI. In a small company, I also take part in product and management decisions.

My day-to-day work lives in On Page's private repositories. What you see here are side projects I build in my limited spare time, which AI agents have made possible.

[LinkedIn](https://www.linkedin.com/in/andrian-leah/)

## At On Page

- **Sole owner of the product UI.** Requirements, UX and UI analysis, design, implementation and testing for the whole application.
- **Part of the decision-making.** I join the company's product, planning and management calls, and bring the UI and UX perspective to them.
- **Front-end rewrite on a new design system.** I designed a library of more than 160 components and rebuilt the product's interface on top of it.
- **Complex modules beyond the core PIM:** ticketing, Gantt planning, and a visual template builder that renders PIM data with loops, conditions and local data handling, backed by a separate Vue rendering library that also produces print-ready PDFs.
- **An AI-assisted UI workflow,** so that colleagues who only occasionally touch the front end still ship consistent, well-built pages:
  1. Analyse the current behaviour and lock it in with characterization tests, unit and end-to-end.
  2. Generate mockups with AI in FigCraft, then refine them by hand. The mockups use a FigCraft copy of the design system, which a generator keeps in step with the code.
  3. Have AI agents implement the new UI from the mockups and the design system. Claude Code skills, a dedicated agent and an automated design-system check keep every edit within the system.
  4. Run the Playwright end-to-end tests, and update them where the UX changes on purpose.
  5. Check edge-case projects by hand and iterate on the mockups after implementation.

  AI agents work with real data through the product's MCP server, and drive the design tools through MCP as well.

## Open source

### [On Page Media Downloader](https://github.com/onpage-dev/op-media-downloader)

A desktop app for Windows, macOS and Linux that keeps local, network and external-disk folders in sync with the media of an On Page project. It is used by the company's business customers.

- I built it from scratch in Electron and TypeScript, then widened its scope into a full sync tool: incremental syncs, safe removals that need confirmation, folder locks shared between computers, and recovery from full disks and dropped network shares.
- I then led its migration to Tauri with a Rust core. AI agents wrote the Rust code from the logic I had designed and proven in the Electron version.
- Version 2.0 adds a command line and server mode, and an MCP server so that AI agents can run every operation the app offers. It ships with cross-platform CI, signed and notarized macOS builds, build provenance on every release, and over 200 tests.

### Experiments that shaped the workflow

I built these while setting up the workflow above for the ArtCraft creative suite, and they started from my own needs as a user. Both are in real use: I fixed every issue that users opened, and one external contribution has been merged.

| Project | What it does |
| --- | --- |
| [craft-mcp-hub](https://github.com/AndrianLeah/craft-mcp-hub) | One shared MCP server per ArtCraft app, for every AI client. Colleagues set up the whole design workflow in one click. |
| [ai-remove-lightcraft](https://github.com/AndrianLeah/ai-remove-lightcraft) | Removes objects, people and reflections from photos with local AI models, and writes the result back into a RAW DNG. |

### Also on GitHub

- [String-Tuner](https://github.com/AndrianLeah/String-Tuner): a real-time chromatic tuner for the web and Android ([demo](https://andrianleah.github.io/String-Tuner/)).

## Stack

**Front end:** Vue 3, TypeScript, Vite, Tailwind CSS, Sass, Vue Router, vue-i18n, design systems
**Rich interfaces:** Konva (canvas), ECharts, Three.js, Tiptap, Monaco Editor, PDF.js
**Testing:** Vitest, Playwright
**Desktop:** Electron, Tauri
**AI and design:** Claude Code (skills and agents), MCP, FigCraft

## Outside work

Amateur photographer and guitarist, which is where AI Remove and String-Tuner come from.
