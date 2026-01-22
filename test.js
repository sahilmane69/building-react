import React from "./index.js";

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ count: this.state.count + 1 });
        }, 1000);
    }

    render() {
        return React.createElement(
            "div",
            null,
            "Count: ",
            this.state.count
        );
    }
}

const App = React.createElement(Counter, null);

const root = document.getElementById("root");
React.render(App, root);
