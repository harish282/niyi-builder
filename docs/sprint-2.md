# NiyiBuilder - Sprint 2 Implementation Guide

## Mission

Build the Editor Shell.

Sprint 1 created the Core Framework.

Sprint 2 creates the visual application layout that users will interact with.

This sprint is focused on layout and panel architecture only.

No element editing functionality is required.

---

# Rules

## DO

* Build reusable UI components
* Create panel architecture
* Create layout system
* Prepare for future extensions

## DO NOT

* Render Elements
* Implement Drag & Drop
* Implement Document Management
* Implement Properties Editing
* Implement Serialization
* Implement Gutenberg Integration
* Implement Forms
* Implement Animations

Focus only on the Editor Shell.

---

# Project Structure

Create:

packages/editor/src/

```text
editor/

components/
layouts/
panels/
toolbar/
hooks/
types/

App.tsx
```

---

# Editor Layout

Create the following layout:

```text
+--------------------------------------------------+
|                    Top Bar                       |
+---------+----------------------+-----------------+
|         |                      |                 |
|         |                      |                 |
| Elements|       Canvas         |   Properties    |
| Panel   |                      |     Panel       |
|         |                      |                 |
|         |                      |                 |
+---------+----------------------+-----------------+
|                  Status Bar                       |
+--------------------------------------------------+
```

---

# Main Regions

## Top Bar

Responsibilities:

* Save Button
* Undo Button
* Redo Button
* Preview Button
* Publish Button

For now buttons can be placeholders.

No functionality required.

---

## Left Panel

Initial Tabs:

```text
Elements
Navigator
```

Only Elements tab is required for this sprint.

Navigator is a placeholder.

---

## Canvas

The central workspace.

Responsibilities:

* Display empty canvas
* Display future content
* Support future zooming

For now render:

```text
Drop elements here
```

---

## Right Panel

Initial Tabs:

```text
Properties
Settings
```

Only placeholders are required.

No editing functionality yet.

---

## Status Bar

Display:

* Builder Version
* Current Mode
* Future Notifications Area

Example:

```text
NiyiBuilder v1.0.0 | Ready
```

---

# Component Structure

Create:

components/

```text
TopBar.tsx
Canvas.tsx
StatusBar.tsx
```

---

Create:

panels/

```text
ElementsPanel.tsx
PropertiesPanel.tsx
NavigatorPanel.tsx
SettingsPanel.tsx
```

---

Create:

layouts/

```text
EditorLayout.tsx
```

This component should assemble the entire editor.

---

# Panel System

Create a simple panel abstraction.

Future panels should be pluggable.

Create:

```ts
export interface PanelDefinition {
    id: string;

    title: string;

    component: React.ComponentType;
}
```

This will be expanded later.

---

# Panel Registry

Create:

PanelRegistry

Responsibilities:

```ts
registerPanel()

unregisterPanel()

getPanel()

getAllPanels()
```

This should mirror the ElementRegistry architecture.

Future plugins may register custom panels.

---

# Theme Support

Create:

ThemeProvider

Provide:

```ts
light
dark
```

No styling customization required.

Only architecture.

---

# Editor State

Create:

EditorStore

Store only:

```ts
activeLeftPanel

activeRightPanel

theme

isLoading
```

Do NOT store document data yet.

Document management belongs to Sprint 5.

---

# Deliverables

The application should start and display:

Top Bar

Elements Panel

Canvas

Properties Panel

Status Bar

No errors.

No Element rendering.

No Element editing.

No Serialization.

No Gutenberg integration.

---

# Verification

The following should work:

```ts
setActiveLeftPanel(
    "elements"
);
```

```ts
setActiveRightPanel(
    "properties"
);
```

```ts
panelRegistry.registerPanel(
    CustomPanel
);
```

```ts
toggleTheme();
```

---

# Success Criteria

Sprint 2 is complete when:

✓ Editor Shell renders

✓ Panel Registry exists

✓ Top Bar exists

✓ Canvas exists

✓ Elements Panel exists

✓ Properties Panel exists

✓ Status Bar exists

✓ Theme support exists

✓ Editor state exists

✓ No business logic exists

The result should look like a professional website builder shell waiting for functionality to be added in later sprints.
