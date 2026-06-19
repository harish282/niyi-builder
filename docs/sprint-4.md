# NiyiBuilder - Sprint 4 Implementation Guide

## Mission

Build the Container Element.

This is the first Element that can contain other Elements.

The Container becomes the foundation for:

- Sections
- Rows
- Columns
- Hero Areas
- Cards
- Forms
- Galleries
- Layouts

Everything in NiyiBuilder will eventually live inside Containers.

---

# Rules

## DO

- Build Container Element
- Build Nested Elements
- Build Layout System
- Build Child Rendering

## DO NOT

- Build Drag & Drop
- Build Responsive Controls
- Build Animations
- Build Serialization
- Build Wizards

Focus only on Containers.

---

# Goal

The following flow must work:

```text id="h69ubc"
Add Container
↓
Container appears
↓
Add Heading inside Container
↓
Heading renders
↓
Add Button inside Container
↓
Button renders
```

---

# Container Architecture

Container is an Element.

Create:

```text id="ewck75"
elements/
└── container/
```

Files:

```text id="kz61g5"
definition.ts
canvas.tsx
properties.tsx
defaults.ts
index.ts
```

---

# Container Definition

Create:

```ts id="aj1jjr"
type: 'container';
```

Category:

```text id="f2px2z"
Layout
```

Allow children:

```ts id="q1dcbn"
canHaveChildren: true;
```

---

# Container Defaults

Create:

```ts id="7ljq8s"
{
    layout: {
        type: "flex",
        direction: "row",
        gap: "md"
    }
}
```

---

# Layout Model

Do NOT store:

```ts id="b0e67m"
layoutType;
direction;
gap;
columns;
```

at the root.

Store:

```ts id="4dwwux"
layout: {
    type: "flex",
    direction: "row",
    justify: "start",
    align: "start",
    gap: "md"
}
```

Future Grid:

```ts id="gjz7bw"
layout: {
    type: "grid",
    columns: 3,
    gap: "md"
}
```

This structure will scale later.

---

# ElementNode Update

Update:

```ts id="8xhxtm"
ElementNode;
```

to support nesting.

Already exists:

```ts id="0ocmny"
children: ElementNode[]
```

Now start using it.

---

# Document Manager

Add methods:

```ts id="7vt2ae"
addChildElement();

removeChildElement();

moveElement();
```

Example:

```text id="5cvah5"
Container
└── Heading
```

Add Heading as child of Container.

---

# Canvas Renderer

Update renderer.

Current:

```text id="yxtig4"
Render single elements
```

New:

```text id="p5l89n"
Render recursively
```

Pseudo:

```ts id="j8n0ja"
renderElement(node)

render children

renderElement(child)
```

The renderer must support unlimited nesting.

---

# Container Canvas

Render:

```html id="g6dnc8"
<div>children...</div>
```

Then render:

```ts id="2n5blq"
node.children;
```

using CanvasRenderer.

Container should not know child types.

Registry handles rendering.

---

# Add Child Workflow

User selects Container.

Elements Panel changes mode:

```text id="rwgwxl"
Add To Container
```

When user clicks:

```text id="o1oq2d"
Heading
```

Create:

```text id="89u6vc"
Container
└── Heading
```

instead of adding to root.

---

# Selection System

Selection must support:

```text id="fmpd8h"
Root Elements

Nested Elements

Deeply Nested Elements
```

Example:

```text id="kz0hqh"
Container
└── Container
    └── Heading
```

All must be selectable.

---

# Properties Panel

Container Properties:

Layout Type

```text id="9v9j3u"
Flex
Grid
```

Flex Properties:

```text id="bn8g5u"
Direction

Row
Column
```

Gap:

```text id="38y5ez"
None
Small
Medium
Large
```

Only these controls are required.

Keep it simple.

---

# Events

Emit:

```text id="yyulz9"
container.created
```

Emit:

```text id="gvck8w"
element.addedToContainer
```

Emit:

```text id="v7ck93"
container.updated
```

Use EventManager.

---

# Example Document

The following structure should work:

```json id="gq1pnp"
{
  "elements": [
    {
      "type": "container",
      "children": [
        {
          "type": "heading"
        }
      ]
    }
  ]
}
```

---

# Verification

The following must work:

```text id="m57oz5"
Add Container
↓
Container appears
```

---

```text id="x92uvs"
Select Container
↓
Add Heading
↓
Heading becomes child
```

---

```text id="d9xnup"
Container
↓
Container
↓
Heading
```

Nested rendering works.

---

```text id="2nn24k"
Change Flex Direction
↓
Canvas updates
```

---

# Success Criteria

Sprint 4 is complete when:

✓ Container Element exists

✓ Nested Elements work

✓ Recursive Rendering works

✓ Child Elements work

✓ Container Properties work

✓ Layout model exists

✓ Selection supports nesting

✓ Events are emitted

✓ Unlimited nesting works

At the end of Sprint 4 NiyiBuilder gains its first real layout system.

From this point onward, every future Element can be built inside Containers.
