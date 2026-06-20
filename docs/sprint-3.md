# NiyiBuilder - Sprint 3 Implementation Guide

## Mission

Build the Document System and first Element rendering.

This sprint connects:

Element Registry
↓
Document
↓
Canvas

This is the first sprint where users can create content.

---

# Rules

## DO

- Build Document Manager
- Build Canvas Renderer
- Build Element Selection
- Build first Element (Heading)

## DO NOT

- Build Drag & Drop
- Build Containers
- Build Wizards
- Build Serialization
- Build Responsive Controls
- Build Animations

Focus on rendering and editing one Element.

---

# Goal

The following flow must work:

```text id="yoclg6"
Click Heading
↓
Heading added to Document
↓
Heading rendered on Canvas
↓
Heading selected
↓
Properties displayed
```

---

# Project Structure

Create:

builder/core/src/document/

```text id="jyvcfd"
DocumentManager.ts
DocumentValidator.ts
```

---

Create:

builder/editor/src/canvas/

```text id="8mrppx"
CanvasRenderer.tsx
CanvasNode.tsx
SelectionOverlay.tsx
```

---

Create:

builder/elements/src/heading/

```text id="eyr3u0"
definition.ts
canvas.tsx
properties.tsx
defaults.ts
index.ts
```

---

# Document Structure

Create:

```ts id="v8hz58"
export interface BuilderDocument {
  id: string;

  title: string;

  elements: ElementNode[];
}
```

---

# Document Manager

Responsibilities:

- Create document
- Add element
- Remove element
- Update element
- Find element

Methods:

```ts id="xzz2zb"
createDocument();

addElement();

removeElement();

updateElement();

findElement();
```

---

# Editor Store

Extend existing store.

Add:

```ts id="10ujz8"
document;

selectedElementId;
```

Methods:

```ts id="cokng4"
setDocument();

selectElement();

clearSelection();
```

---

# Canvas Renderer

Create:

CanvasRenderer

Responsibilities:

Render all document elements.

Pseudo:

```ts id="9n4eui"
document.elements.map(renderElement);
```

---

# Element Rendering

Canvas must never know element types.

Do NOT do:

```ts id="06h6ij"
if(type === "heading")
```

Do NOT do:

```ts id="h06qsa"
switch(type)
```

Use registry.

Example:

```ts id="e1m11m"
const definition = registry.getElement(node.type);
```

Render:

```ts id="f97s3s"
<definition.Canvas
    node={node}
/>
```

---

# First Element

Create:

Heading Element

Definition:

```ts id="6gchzs"
type: 'heading';
```

Defaults:

```ts id="5yxujv"
{
  text: 'Heading';
}
```

Canvas:

```html id="1jz9r5"
<h2>Heading</h2>
```

Properties:

```text id="sfdjca"
Text
Tag
```

Only these two properties are required.

---

# Add Element Workflow

ElementsPanel

When user clicks:

```text id="hnizfu"
Heading
```

Execute:

```ts id="mgw0w4"
documentManager.addElement(HeadingElement);
```

Element appears on Canvas.

---

# Selection System

Create:

SelectionOverlay

Requirements:

- Click element
- Select element
- Highlight selection

Store:

```ts id="v8b9c6"
selectedElementId;
```

---

# Properties Panel

When selection changes:

```text id="qqbdt4"
Canvas
↓
Selection
↓
Properties Panel
```

Load:

```ts id="d0e1hq"
definition.Properties;
```

from registry.

Editor must not know element types.

---

# Event Integration

Emit:

```text id="h8nj5t"
element.created
```

when element is added.

Emit:

```text id="1b3gwx"
element.updated
```

when changed.

Emit:

```text id="s8b2ku"
element.selected
```

when selected.

Use EventManager from Sprint 1.

---

# Verification

The following should work:

```text id="gwghp4"
Click Heading
↓
Canvas updates
```

---

```text id="pc13j7"
Click Heading
↓
Selection appears
```

---

```text id="o7z1w3"
Selection
↓
Properties Panel updates
```

---

```text id="o4nupq"
Edit Text
↓
Canvas updates live
```

---

# Success Criteria

Sprint 3 is complete when:

✓ Document Manager exists

✓ BuilderDocument exists

✓ Heading Element exists

✓ Canvas Renderer exists

✓ Element Selection exists

✓ Properties Panel loads dynamically

✓ Events are emitted

✓ User can add Heading

✓ User can edit Heading

✓ Canvas updates live

At the end of Sprint 3 NiyiBuilder becomes a working page builder for the first time.

A user can create content, see it on the Canvas, select it, and edit it.
