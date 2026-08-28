# Zero-Build SVG Architecture

## Objective
To provide a single source of truth for SVG rendering that supports both interactive browser UIs (React-based) and standalone file exports (Downloads/Printing) without a build pipeline (Zero-Build).

## The Problem: "Double-Life" Rendering
In many apps (e.g., *Outfitter*, *Cobblestone*), SVG logic is duplicated:
1. **JSX/React**: Used for the UI to allow for interactivity (`onClick`) and reactivity.
2. **String Templates**: Used for downloads/printing because React cannot easily render to a string in a browser-only environment without `ReactDOMServer`.

This duplication leads to sync errors where the UI and the exported file diverge.

## The Solution: XSLT + Global Event Bridge
By moving the SVG logic into **XSLT (Extensible Stylesheet Language Transformations)**, we can use a single declarative template for both purposes.

### 1. JSON-to-XML Conversion
Browser-native XSLT (v1.0) requires XML input. A small utility converts our JSON state into an XML DOM tree.

```javascript
const jsonToXml = (obj, rootName = 'data') => {
  const doc = document.implementation.createDocument('', rootName, null);
  const build = (parent, data) => {
    if (typeof data === 'object' && !Array.isArray(data)) {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object') {
          const child = doc.createElement(key);
          parent.appendChild(child);
          build(child, value);
        } else {
          parent.setAttribute(key, value);
        }
      });
    } else if (Array.isArray(data)) {
      data.forEach((item) => {
        const child = doc.createElement('item');
        parent.appendChild(child);
        build(child, item);
      });
    }
  };
  build(doc.documentElement, obj);
  return doc;
};
```

### 2. XSLT Rendering Pipeline
The XSLT defines the SVG structure. In the UI, the `XSLTProcessor` generates a DOM fragment that is injected into the React container.

```javascript
const processor = new XSLTProcessor();
processor.importStylesheet(xslStylesheet);
const svgFragment = processor.transformToFragment(jsonToXml(state), document);
// UI: container.appendChild(svgFragment);
// File: new XMLSerializer().serializeToString(svgFragment);
```

### 3. Global Event Bridge
To maintain interactivity without React Synthetic Events, we use a global bridge that dispatches native `CustomEvents`.

**In XSLT/SVG:**
```xml
<a href="#" onclick="window.sp.dispatch('selectLayer', {@index})">
  <use href="#{@part}" />
</a>
```

**In `apps/common/trigger.js`:**
```javascript
window.sp = window.sp || {};
window.sp.dispatch = (eventName, detail) => {
  const event = new CustomEvent(eventName, { detail, bubbles: true });
  window.dispatchEvent(event);
};
```

**In the React Component:**
The component listens for the event on the window and updates its state, triggering a re-transformation.

```javascript
componentDidMount() {
  window.addEventListener('selectLayer', (e) => {
    this.setState({ selectedIndex: e.detail });
  });
}
```

## Benefits
1. **Single Source of Truth**: SVG layout is defined in one `.xsl` file.
2. **Performance**: Moves complex rendering out of React's Virtual DOM; the browser's native XSLT engine handles the heavy lifting.
3. **Zero-Build**: Relies entirely on native browser APIs (XSLTProcessor, CustomEvents, XMLSerializer).
4. **Portability**: The same XSLT can be used in other tools or environments without modification.
