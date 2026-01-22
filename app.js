import { createElement, Component, render } from "./mini-react.js";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  componentDidMount() {
    console.log("Counter mounted with prop:", this.props.title);
  }

  handleIncrement() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return createElement(
      "div",
      {
        style:
          "border: 1px solid #ccc; padding: 20px; margin: 10px; border-radius: 8px;",
      },
      createElement(
        "h2",
        { style: "color: #333;" },
        `${this.props.title}: ${this.state.count}`,
      ),
      createElement(
        "button",
        {
          onClick: this.handleIncrement,
          style:
            "padding: 8px 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;",
        },
        "Increment",
      ),
      this.state.count > 0
        ? createElement("p", null, "Count is positive!")
        : null,
    );
  }
}

function Greeting(props) {
  return createElement(
    "div",
    { style: "color: #555; font-style: italic; margin-bottom: 20px;" },
    `Hello, ${props.name}! This is a functional component.`,
  );
}

function App() {
  return createElement(
    "div",
    { id: "app-container", style: "font-family: sans-serif;" },
    createElement("h1", null, "Mini React Demo"),
    createElement(Greeting, { name: "User" }),
    createElement(Counter, { title: "First Counter" }),
    createElement(Counter, { title: "Second Counter" }),
  );
}

const root = document.getElementById("root");
render(createElement(App), root);
