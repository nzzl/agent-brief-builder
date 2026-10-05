# Agent Brief Builder

A tiny, dependency-free tool for turning rough coding task notes into a structured brief for Claude Code, Codex, or another coding agent.

Built as a small artifact for the Flywheel assessment and the prommer.net audience.

## Design decisions

- **Deterministic by design:** this is a structuring problem, not a generation problem. The tool uses no model call and never invents requirements.
- **Only what you provide:** empty sections are omitted, while the wording and line breaks in populated fields are preserved.
- **Private and portable:** everything runs in the browser. There is no backend, account, storage, or external dependency.
- **Deliberately small:** plain HTML, CSS, and JavaScript make the project easy to inspect and deploy anywhere that serves static files.

## Run locally

Open `index.html` directly, or serve the folder with any static file server.

## Files

- `index.html` — semantic page structure and form controls
- `styles.css` — responsive, accessible presentation
- `app.js` — prompt formatting, example loading, and clipboard behavior
