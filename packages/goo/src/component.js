export class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(partialState) {
    console.warn(
      "Class Components are not fully supported in this Fiber version. Use Functional Components with Hooks.",
    );
  }
}
