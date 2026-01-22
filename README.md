# Goo Humanify

Goo is a minimalist, educational implementation of a React-like library. It strips away production complexity to reveal the core algorithms behind Reactive UIs.

## Philosophy

Modern frameworks are complex. Goo is different:

- **Transparent**: Every line of code is readable.
- **Educational**: Demonstrates the "Stack Reconciler" architecture.
- **Functional**: Supports Components, State, and Virtual DOM.

## Architecture

Goo mimics the architecture of React 15.

### 1. Virtual DOM (src/element.js)

Goo works with lightweight JavaScript objects instead of directly manipulating the browser DOM.

### 2. Reconciler (src/reconciler.js)

The core recursive algorithm that compares new and previous Virtual DOM trees to update the real DOM efficiently.

### 3. Component System (src/component.js)

Supports both Class Components (stateful) and Functional Components (stateless).

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

### 1. The Reconciler

_Problem_: Initial attempts re-rendered the entire page on every state update.
_Solution_: Implemented a diffing algorithm to recursively check element types and update props or replace nodes as needed.

### 2. Component Identity

_Problem_: Distinguishing between functional and class components.
_Solution_: Checks for `prototype.render` during instantiation to branch logic correctly.

### 3. Unmounting

_Problem_: Manual DOM clearing caused internal reference issues in tests.
_Solution_: Implemented proper unmounting logic to clean up internal references.

## Roadmap

- [x] Virtual DOM
- [x] Reconciliation
- [x] Components (Class & Functional)
- [ ] Hooks (useState, useEffect)
- [ ] Fiber Architecture

## License

MIT. Made by Sahil Mane.
