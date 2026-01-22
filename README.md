# Goo Humanify

Goo is a minimalist, educational implementation of a React-like library. It strips away production complexity to reveal the core algorithms behind Reactive UIs.

## Philosophy

Modern frameworks are complex. Goo is different:

- **Transparent**: Every line of code is readable.
- **Educational**: Demonstrates "**Fiber Architecture**" and **Hooks**.
- **Modern**: Uses `requestIdleCallback` for concurrent mode.

## Architecture

Goo mimics the architecture of Modern React (Fiber).

### 1. Virtual DOM (src/element.js)

Goo works with lightweight JavaScript objects instead of directly manipulating the browser DOM.

### 2. Fiber Reconciler (src/reconciler.js)

The core engine. Unlike the old Stack reconciler, Fiber:

- Breaks work into small units.
- Uses `requestIdleCallback` to avoid blocking the main thread.
- Supports Functional Components with Hooks.

### 3. Hooks (src/reconciler.js)

Implements `useState` by linking state to Fiber nodes.

## Getting Started

### Installation

Clone the repository:

```bash
git clone https://github.com/sahilmane69/building-react.git
cd building-react
```

### Running the Demo

Serve the project using a local server (e.g., Python):

```bash
python3 -m http.server 8000
```

Navigate to `http://localhost:8000/examples/demo/index.html`.

## Challenges & Learnings

### 1. From Stack to Fiber

_Problem_: Recursive rendering blocks the main thread for large trees.
_Solution_: Implemented a "Work Loop" using `requestIdleCallback` to yield control back to the browser.

### 2. Implementing Hooks

_Problem_: Functions are stateless, so where do we store `count`?
_Solution_: We attached a `hooks` array to each Fiber node. `useState` reads from this array based on the call index.

## Features

- [x] Virtual DOM
- [x] Fiber Reconciliation (Concurrent Mode)
- [x] Functional Components
- [x] Hooks (useState)
- [ ] Class Components (Deprecated in Fiber version for simplicity)

## License

MIT. Made by Sahil Mane.
