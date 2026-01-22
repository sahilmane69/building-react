export class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};
        this.__internalInstance = null; // used by renderer
    }

    setState(partialState) {
        this.state = {
            ...this.state,
            ...partialState
        };

        // trigger update
        if (this.__internalInstance) {
            this.__internalInstance.update();
        }
    }

    render() {
        throw new Error("Component.render() must be implemented");
    }
}
