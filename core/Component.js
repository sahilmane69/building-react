import { updateInstance } from "./renderer.js";

export class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};
        this.__internalInstance = null;
    }

    setState(partialState) {
        this.state = {
            ...this.state,
            ...partialState
        };

        updateInstance(this.__internalInstance);
    }
}
