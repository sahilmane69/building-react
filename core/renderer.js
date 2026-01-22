export function render(element, container) {
    const prevInstance = container.__rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    container.__rootInstance = nextInstance;
}

export function updateInstance(internalInstance) {
    const parentDom = internalInstance.dom.parentNode;
    reconcile(parentDom, internalInstance, internalInstance.element);
}

function reconcile(parentDom, instance, element) {
    if (instance == null) {
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    }

    if (element == null) {
        parentDom.removeChild(instance.dom);
        return null;
    }

    if (instance.element.type !== element.type) {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }

    // TEXT
    if (element.type === "TEXT_ELEMENT") {
        instance.dom.nodeValue = element.props.nodeValue;
        instance.element = element;
        return instance;
    }

    // DOM ELEMENT
    if (typeof element.type === "string") {
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    }

    // COMPONENT
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);

    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;

    return instance;
}

function reconcileChildren(instance, element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances || [];
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];

    const count = Math.max(childInstances.length, nextChildElements.length);

    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const newChildInstance = reconcile(dom, childInstance, childElement);
        if (newChildInstance != null) newChildInstances.push(newChildInstance);
    }

    return newChildInstances;
}

function instantiate(element) {
    const { type, props } = element;

    // TEXT
    if (type === "TEXT_ELEMENT") {
        const dom = document.createTextNode(props.nodeValue);
        return { dom, element, childInstances: [] };
    }

    // DOM ELEMENT
    if (typeof type === "string") {
        const dom = document.createElement(type);
        updateDomProperties(dom, {}, props);

        const childInstances = props.children.map(instantiate);
        childInstances.forEach(child => dom.appendChild(child.dom));

        return { dom, element, childInstances };
    }

    // COMPONENT
    if (typeof type === "function") {
        const instance = {};
        const publicInstance = new type(props);
        publicInstance.__internalInstance = instance;

        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);
        const dom = childInstance.dom;

        Object.assign(instance, {
            dom,
            element,
            childInstance,
            publicInstance
        });

        if (publicInstance.componentDidMount) {
            setTimeout(() => publicInstance.componentDidMount(), 0);
        }

        return instance;
    }
}

function updateDomProperties(dom, prevProps, nextProps) {
    Object.keys(prevProps)
        .filter(name => name !== "children")
        .forEach(name => {
            dom[name] = null;
        });

    Object.keys(nextProps)
        .filter(name => name !== "children")
        .forEach(name => {
            dom[name] = nextProps[name];
        });
}
