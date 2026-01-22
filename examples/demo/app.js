import {
  createElement,
  render,
  useState,
} from "../../packages/goo/src/index.js";

function Counter({ title }) {
  const [count, setCount] = useState(0);

  return createElement(
    "div",
    {
      style:
        "border: 1px solid #ccc; padding: 20px; margin: 10px; border-radius: 8px;",
    },
    createElement("h2", { style: "color: #333;" }, `${title}: ${count}`),
    createElement(
      "button",
      {
        onClick: () => setCount((c) => c + 1),
        style:
          "padding: 8px 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;",
      },
      "Increment",
    ),
    count > 0 ? createElement("p", null, "Count is positive!") : null,
  );
}

function Greeting(props) {
  return createElement(
    "div",
    { style: "color: #555; font-style: italic; margin-bottom: 20px;" },
    `Hello, ${props.name}! This is a functional component with Hooks.`,
  );
}

function App() {
  return createElement(
    "div",
    { id: "app-container", style: "font-family: sans-serif;" },
    createElement("h1", null, "Goo Fiber + Hooks Demo"),
    createElement(Greeting, { name: "Explorer" }),
    createElement(Counter, { title: "Hook Counter 1" }),
    createElement(Counter, { title: "Hook Counter 2" }),
  );
}

const root = document.getElementById("root");
render(createElement(App), root);
