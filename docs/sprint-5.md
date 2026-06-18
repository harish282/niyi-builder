# NiyiBuilder - Sprint 5 Implementation Guide

## Mission

Build the Layout Wizard System.

The purpose of the Layout Wizard is to help users create structured layouts visually without manually building container hierarchies.

This sprint introduces:

* Wizard Registry
* Layout Wizard
* Layout Presets
* Auto-generated Container Structures

This is the first feature that makes NiyiBuilder feel user-friendly.

---

# Rules

## DO

* Build Wizard System
* Build Layout Presets
* Auto-generate Container Structures
* Keep wizard architecture extensible

## DO NOT

* Build Templates
* Build Animations
* Build Responsive Controls
* Build Serialization
* Build Drag & Drop

Focus only on creation workflows.

---

# Goal

The following flow must work:

Add Element
↓
Choose Container
↓
Layout Wizard Opens
↓
Select Layout
↓
Generate Structure
↓
Insert Into Document

---

# Project Structure

Create:

packages/core/src/wizards/

```text
WizardRegistry.ts
WizardManager.ts
types.ts
```

---

Create:

packages/editor/src/dialogs/

```text
LayoutWizard.tsx
```

---

Create:

packages/elements/src/container/

```text
presets.ts
wizard.tsx
```

---

# Wizard Architecture

Some Elements may require creation steps.

Examples:

Container

Form

Gallery

Pricing Table

Hero Section

Those Elements may register Wizards.

---

# Wizard Definition

Create:

```ts
export interface WizardDefinition {
    id: string;

    title: string;

    elementType: string;

    component: React.ComponentType<any>;
}
```

---

# Wizard Registry

Create:

```ts
registerWizard()

unregisterWizard()

getWizard()

getWizardForElement()
```

---

# Wizard Flow

When user clicks:

```text
Container
```

System checks:

```ts
WizardRegistry.getWizardForElement(
    "container"
)
```

If wizard exists:

Open Wizard

Otherwise:

Create Element immediately

---

# Container Wizard

The Container Element should register a wizard.

Purpose:

Allow user to select layout before creation.

---

# Wizard Step 1

Choose Layout Type

Options:

```text
Flex
Grid
```

Display visually.

Not dropdowns.

Use cards/buttons.

---

# Wizard Step 2

Choose Preset

If Flex selected:

```text
1 Column
2 Columns
3 Columns
4 Columns
```

If Grid selected:

```text
2 Columns
3 Columns
4 Columns
6 Columns
12 Columns
```

Display as visual previews.

---

# Layout Presets

Create:

container/presets.ts

Example:

```ts
FlexTwoColumns
```

Produces:

```json
{
  "type": "container",
  "layout": {
    "type": "flex"
  },
  "children": [
    {
      "type": "container"
    },
    {
      "type": "container"
    }
  ]
}
```

---

# Grid Presets

Example:

```ts
GridThreeColumns
```

Produces:

```json
{
  "type": "container",
  "layout": {
    "type": "grid",
    "columns": 3
  },
  "children": [
    {
      "type": "container"
    },
    {
      "type": "container"
    },
    {
      "type": "container"
    }
  ]
}
```

---

# Layout Factory

Create:

packages/core/src/layouts/

```text
LayoutFactory.ts
```

Responsibilities:

Generate document structures from presets.

Example:

```ts
createLayout(
    "flex-2-columns"
)
```

Returns:

```text
Container
├── Container
└── Container
```

---

# Visual Preview System

Every preset should provide:

```ts
id
title
thumbnail
create()
```

Example:

```ts
{
    id: "flex-2",

    title: "2 Columns",

    thumbnail: "...",

    create: () => ElementNode
}
```

The Wizard should display thumbnails.

---

# Generated Layouts

Required presets:

Flex

```text
1 Column
2 Columns
3 Columns
4 Columns
```

Grid

```text
2 Columns
3 Columns
4 Columns
6 Columns
12 Columns
```

Nothing more.

Keep scope small.

---

# Insert Workflow

User selects:

```text
Flex
↓
2 Columns
```

System generates:

```text
Container
├── Container
└── Container
```

and inserts into document.

---

# Events

Emit:

```text
wizard.opened
```

Emit:

```text
layout.selected
```

Emit:

```text
layout.created
```

Emit:

```text
container.generated
```

---

# Verification

The following must work:

```text
Click Container
↓
Wizard Opens
```

---

```text
Select Flex
↓
Select 2 Columns
```

---

```text
Container
├── Container
└── Container
```

is generated automatically.

---

```text
Generated layout
↓
Inserted into Canvas
```

---

# Success Criteria

Sprint 5 is complete when:

✓ Wizard Registry exists

✓ Container Wizard exists

✓ Layout Factory exists

✓ Flex Presets exist

✓ Grid Presets exist

✓ Visual Preset Selection works

✓ Generated Layouts are inserted into Document

✓ Events are emitted

At the end of Sprint 5 users no longer create empty Containers.

They create complete layouts in one action, similar to Elementor, Bricks, and modern visual builders.
