import { updateInstance } from "./reconciler.js";

export class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this._internalInstance = null;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    updateInstance(this._internalInstance);
  }
}
