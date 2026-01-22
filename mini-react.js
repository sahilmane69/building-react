export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children
        .flat()
        .filter((child) => child != null && child !== false && child !== true)
        .map((child) =>
          typeof child === "object" ? child : createTextElement(child),
        ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

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

let rootInstance = null;

export function render(element, container) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

function reconcile(parentDom, instance, element) {
  if (instance == null) {
    const newInstance = instantiate(element);
    if (newInstance) {
      parentDom.appendChild(newInstance.dom);
    }
    return newInstance;
  }

  if (element == null) {
    parentDom.removeChild(instance.dom);
    instance.dom = null;
    return null;
  }

  if (instance.element.type !== element.type) {
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }

  if (element.type === "TEXT_ELEMENT") {
    if (instance.element.props.nodeValue !== element.props.nodeValue) {
      instance.dom.nodeValue = element.props.nodeValue;
    }
    instance.element = element;
    return instance;
  }

  if (typeof element.type === "string") {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  }

  let childElement;
  if (instance.publicInstance) {
    instance.publicInstance.props = element.props;
    childElement = instance.publicInstance.render();
  } else {
    childElement = element.type(element.props);
  }

  const oldChildInstance = instance.childInstance;
  const childInstance = reconcile(parentDom, oldChildInstance, childElement);

  instance.dom = childInstance ? childInstance.dom : null;
  instance.childInstance = childInstance;
  instance.element = element;

  return instance;
}

function reconcileChildren(instance, element) {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    if (newChildInstance) {
      newChildInstances.push(newChildInstance);
    }
  }

  return newChildInstances;
}

function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;
  reconcile(parentDom, internalInstance, element);
}

function instantiate(element) {
  if (element == null) return null; // Guard against null element
  const { type, props } = element;
  const isTextElement = type === "TEXT_ELEMENT";
  const isDomElement = typeof type === "string";

  if (isDomElement || isTextElement) {
    const dom = isTextElement
      ? document.createTextNode(props.nodeValue)
      : document.createElement(type);

    updateDomProperties(dom, {}, props);

    const childInstances = (props.children || []).map(instantiate);
    const childDomNodes = childInstances.map((child) => child.dom);
    childDomNodes.forEach((childDom) => dom.appendChild(childDom));

    return {
      dom,
      element,
      childInstances,
      publicInstance: null,
    };
  }

  if (typeof type === "function") {
    const isClass = type.prototype && type.prototype.render;
    const instance = {};

    if (isClass) {
      const publicInstance = new type(props);
      publicInstance._internalInstance = instance;
      const childElement = publicInstance.render();
      const childInstance = instantiate(childElement);
      const dom = childInstance.dom;

      Object.assign(instance, {
        dom,
        element,
        childInstance,
        publicInstance,
      });

      if (publicInstance.componentDidMount) {
        setTimeout(() => publicInstance.componentDidMount(), 0);
      }
    } else {
      const childElement = type(props);
      const childInstance = instantiate(childElement);
      const dom = childInstance.dom;

      Object.assign(instance, {
        dom,
        element,
        childInstance,
        publicInstance: null,
      });
    }

    return instance;
  }
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = (name) => name.startsWith("on");
  const isAttribute = (name) => !isEvent(name) && name !== "children";

  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach((name) => {
      if (!(name in nextProps)) {
        dom[name] = null;
      }
    });

  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
