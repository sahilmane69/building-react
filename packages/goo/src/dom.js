export function socketDomProperties(dom, prevProps, nextProps) {
  // Rename this function internally to avoid the cycle until we fully fix the structure
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

export function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  socketDomProperties(dom, {}, fiber.props);

  return dom;
}

export function updateDom(dom, prevProps, nextProps) {
  return socketDomProperties(dom, prevProps, nextProps);
}

// Export as updateDomProperties for backward compatibility/external use
export { socketDomProperties as updateDomProperties };
