# NiyiBuilder - Sprint 1 Implementation Guide

## Mission

Build the foundation of NiyiBuilder.

This is NOT a Gutenberg clone.

This is NOT Elementor.

This is NOT a WordPress plugin implementation yet.

We are building the Core Framework that will power NiyiBuilder.

The goal of Sprint 1 is to create the architecture, not the editor.

---

# Rules

## DO

- Keep code simple
- Use TypeScript
- Use interfaces over classes where possible
- Keep everything modular
- Design for plugins/extensions
- Keep packages independent

## DO NOT

- Do not confuse with existing code in packages/, it is a old code and working but I need a different mordern structure
- Build UI
- Build Canvas
- Build Drag & Drop
- Build Gutenberg integration
- Build Forms
- Build Animations
- Build Responsive Controls
- Add unnecessary dependencies

Focus only on framework infrastructure.

---

# Project Structure

Create the following structure.

builder/

core/
utils/

The Editor package will be built later.

---

# Sprint 1 Deliverables

Implement:

1. Types
2. Element Registry
3. Element Validator
4. Event Manager
5. Logger

Nothing else.

---

# 1. Types

Create:

builder/core/src/types/

Create:

ElementNode.ts

```ts
export interface ElementNode {
  id: string;

  type: string;

  attributes: Record<string, unknown>;

  children: ElementNode[];
}
```

Create:

ElementDefinition.ts

```ts
export interface ElementDefinition {
  type: string;

  title: string;

  category: string;

  version: string;

  icon?: unknown;

  defaults: Record<string, unknown>;

  Canvas?: unknown;

  Properties?: unknown;

  Wizard?: unknown;
}
```

---

# 2. Element Registry

Create:

builder/core/src/registry/

Implement:

ElementRegistry

Responsibilities:

- Register Elements
- Unregister Elements
- Find Element
- List Elements

Required methods:

```ts
registerElement();

unregisterElement();

getElement();

getAllElements();

hasElement();
```

Requirements:

- Prevent duplicate element types
- Throw meaningful errors
- Store definitions internally using Map

---

# 3. Element Validator

Create:

builder/core/src/validator/

Implement:

ElementValidator

Responsibilities:

Validate ElementDefinition before registration.

Required checks:

- type exists
- title exists
- category exists
- version exists
- defaults exists

Validation should return:

```ts
{
    valid: boolean;
    errors: string[];
}
```

Registry must refuse invalid Elements.

---

# 4. Event Manager

Create:

builder/core/src/events/

Implement:

EventManager

Required methods:

```ts
on();

off();

emit();

once();
```

Requirements:

- Multiple listeners per event
- Safe listener removal
- Typed events where possible
- No external libraries

Example:

```ts
eventManager.on('element.created', callback);
```

```ts
eventManager.emit('element.created', payload);
```

---

# 5. Logger

Create:

builder/utils/src/logger/

Implement:

Logger

Methods:

```ts
info();

warn();

error();

debug();
```

Requirements:

- Prefix messages
- Support namespaces

Example:

```ts
logger.info('Registry', 'Heading registered');
```

Output:

```text
[NiyiBuilder][Registry]
Heading registered
```

---

# Example Element

Create a temporary test element.

HeadingElement

```ts
const HeadingElement = {
  type: 'heading',

  title: 'Heading',

  category: 'Basic',

  version: '1.0.0',

  defaults: {
    text: 'Heading',
  },
};
```

Register it through the registry.

---

# Verification

At the end of Sprint 1 the following code must work:

```ts
registry.registerElement(HeadingElement);
```

```ts
registry.hasElement('heading');
```

```ts
registry.getElement('heading');
```

```ts
eventManager.on('element.created', callback);
```

```ts
eventManager.emit('element.created', {});
```

---

# Success Criteria

Sprint 1 is complete when:

✓ Registry works

✓ Validator works

✓ Event Manager works

✓ Logger works

✓ Test Element registers successfully

✓ No UI exists

✓ No Editor exists

✓ No Gutenberg code exists

The goal is a stable Core Framework that future sprints can build upon.
