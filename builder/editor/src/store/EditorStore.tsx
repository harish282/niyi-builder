import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { LeftPanelId, RightPanelId, ThemeMode } from '../types/index.js';
import type { BuilderDocument, ElementNode } from '@niyi-builder/core';
import { EventManager, generateId } from '@niyi-builder/core';

const eventManager = new EventManager();

const createEmptyDocument = (): BuilderDocument => ({
  id: generateId(),
  title: 'Untitled',
  elements: [],
});

function findInTree(elements: ElementNode[], elementId: string): ElementNode | undefined {
  for (const el of elements) {
    if (el.id === elementId) return el;
    const found = findInTree(el.children, elementId);
    if (found) return found;
  }
  return undefined;
}

function addChildToTree(
  elements: ElementNode[],
  parentId: string,
  child: ElementNode,
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === parentId) {
      return { ...el, children: [...el.children, child] };
    }
    if (el.children.length > 0) {
      return { ...el, children: addChildToTree(el.children, parentId, child) };
    }
    return el;
  });
}

function removeFromTree(elements: ElementNode[], elementId: string): ElementNode[] {
  return elements
    .filter((el) => el.id !== elementId)
    .map((el) => ({
      ...el,
      children: removeFromTree(el.children, elementId),
    }));
}

function updateInTree(
  elements: ElementNode[],
  elementId: string,
  updates: Partial<ElementNode>,
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === elementId) {
      const merged: ElementNode = { ...el, ...updates };
      if (updates.attributes) {
        merged.attributes = { ...el.attributes, ...updates.attributes };
      }
      return merged;
    }
    if (el.children.length > 0) {
      return { ...el, children: updateInTree(el.children, elementId, updates) };
    }
    return el;
  });
}

function findInList(
  children: ElementNode[],
  parentId: string | null,
  elementId: string,
): { parentId: string | null; index: number } | undefined {
  for (let i = 0; i < children.length; i++) {
    if (children[i].id === elementId) {
      return { parentId, index: i };
    }
    const found = findInList(children[i].children, children[i].id, elementId);
    if (found) return found;
  }
  return undefined;
}

function containsElement(elements: ElementNode[], elementId: string): boolean {
  return elements.some((el) => el.id === elementId || containsElement(el.children, elementId));
}

function isDescendantOf(elements: ElementNode[], ancestorId: string, elementId: string): boolean {
  for (const el of elements) {
    if (el.id === ancestorId) {
      return containsElement(el.children, elementId);
    }
    if (isDescendantOf(el.children, ancestorId, elementId)) return true;
  }
  return false;
}

function insertChildAt(
  elements: ElementNode[],
  parentId: string | null,
  child: ElementNode,
  index: number,
): ElementNode[] {
  if (parentId === null) {
    const next = [...elements];
    next.splice(index, 0, child);
    return next;
  }
  return elements.map((el) => {
    if (el.id === parentId) {
      const next = [...el.children];
      next.splice(index, 0, child);
      return { ...el, children: next };
    }
    if (el.children.length > 0) {
      return { ...el, children: insertChildAt(el.children, parentId, child, index) };
    }
    return el;
  });
}

interface EditorState {
  activeLeftPanel: LeftPanelId;
  activeRightPanel: RightPanelId;
  theme: ThemeMode;
  isLoading: boolean;
  document: BuilderDocument;
  selectedElementId: string | null;
  pendingWizard: string | null;
  showElements: boolean;

  setActiveLeftPanel: (panel: LeftPanelId) => void;
  setActiveRightPanel: (panel: RightPanelId) => void;
  setTheme: (theme: ThemeMode) => void;
  setLoading: (loading: boolean) => void;
  setDocument: (document: BuilderDocument) => void;
  selectElement: (elementId: string | null) => void;
  openWizard: (elementType: string) => void;
  closeWizard: () => void;
  toggleElements: () => void;
  addElement: (element: ElementNode) => void;
  addChildElement: (parentId: string, child: ElementNode) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<ElementNode>) => void;
  moveElement: (elementId: string, newParentId: string) => void;
  moveElementTo: (elementId: string, overId: string) => void;
  findElement: (elementId: string) => ElementNode | undefined;
}

const EditorContext = createContext<EditorState | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [document, setDocumentState] = useState<BuilderDocument>(createEmptyDocument);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeLeftPanel, setActiveLeftPanel] = useState<LeftPanelId>('elements');
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelId>('properties');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isLoading, setLoading] = useState(false);
  const [pendingWizard, setPendingWizard] = useState<string | null>(null);
  const [showElements, setShowElements] = useState(true);

  const openWizard = useCallback((elementType: string) => {
    setPendingWizard(elementType);
    setShowElements(false);
  }, []);

  const closeWizard = useCallback(() => {
    setPendingWizard(null);
    setShowElements(true);
  }, []);

  const toggleElements = useCallback(() => {
    setShowElements((prev) => !prev);
  }, []);

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
    if (elementId !== null) {
      setShowElements(false);
    }
    eventManager.emit('element.selected', { elementId });
  }, []);

  const addElement = useCallback(
    (element: ElementNode) => {
      setDocumentState((prev) => {
        setSelectedElementId(element.id);
        if (selectedElementId) {
          const parent = findInTree(prev.elements, selectedElementId);
          if (parent) {
            const parentDef = window.__niyiRegistry?.getElement(parent.type);
            if (parentDef?.canHaveChildren) {
              eventManager.emit('element.addedToContainer', {
                parentId: selectedElementId,
                child: element,
              });
              return {
                ...prev,
                elements: addChildToTree(prev.elements, selectedElementId, element),
              };
            }
          }
        }
        eventManager.emit('element.created', { element });
        return {
          ...prev,
          elements: [...prev.elements, element],
        };
      });
    },
    [selectedElementId],
  );

  const addChildElement = useCallback((parentId: string, child: ElementNode) => {
    setDocumentState((prev) => ({
      ...prev,
      elements: addChildToTree(prev.elements, parentId, child),
    }));
    eventManager.emit('element.addedToContainer', { parentId, child });
  }, []);

  const removeElement = useCallback((elementId: string) => {
    setDocumentState((prev) => ({
      ...prev,
      elements: removeFromTree(prev.elements, elementId),
    }));
    eventManager.emit('element.removed', { elementId });
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<ElementNode>) => {
    setDocumentState((prev) => ({
      ...prev,
      elements: updateInTree(prev.elements, elementId, updates),
    }));
    eventManager.emit('element.updated', { elementId, updates });
  }, []);

  const moveElement = useCallback((elementId: string, newParentId: string) => {
    setDocumentState((prev) => {
      const element = findInTree(prev.elements, elementId);
      if (!element) return prev;
      const withoutElement = removeFromTree(prev.elements, elementId);
      return {
        ...prev,
        elements: addChildToTree(withoutElement, newParentId, element),
      };
    });
    eventManager.emit('element.moved', { elementId, newParentId });
  }, []);

  const moveElementTo = useCallback((elementId: string, overId: string) => {
    setDocumentState((prev) => {
      if (elementId === overId) return prev;
      const active = findInTree(prev.elements, elementId);
      if (!active) return prev;
      const target = findInTree(prev.elements, overId);
      if (!target) return prev;
      if (isDescendantOf(prev.elements, elementId, overId)) return prev;

      const targetDef = window.__niyiRegistry?.getElement(target.type);
      const canNest = Boolean(targetDef?.canHaveChildren);

      const activePos = findInList(prev.elements, null, elementId);
      const targetPos = findInList(prev.elements, null, overId);
      if (!activePos || !targetPos) return prev;

      let newParentId: string | null;
      let insertIndex: number;

      if (canNest) {
        newParentId = overId;
        insertIndex = target.children.length;
      } else {
        newParentId = targetPos.parentId;
        insertIndex = targetPos.index;
      }

      const withoutElement = removeFromTree(prev.elements, elementId);
      return { ...prev, elements: insertChildAt(withoutElement, newParentId, active, insertIndex) };
    });
    eventManager.emit('element.moved', { elementId, overId });
  }, []);

  const setDocument = useCallback((doc: BuilderDocument) => {
    setDocumentState(doc);
  }, []);

  const findElement = useCallback(
    (elementId: string) => {
      return findInTree(document.elements, elementId);
    },
    [document],
  );

  const state: EditorState = {
    activeLeftPanel,
    activeRightPanel,
    theme,
    isLoading,
    document,
    selectedElementId,
    pendingWizard,
    showElements,
    setActiveLeftPanel,
    setActiveRightPanel,
    setTheme,
    setLoading,
    setDocument,
    selectElement,
    openWizard,
    closeWizard,
    toggleElements,
    addElement,
    addChildElement,
    removeElement,
    updateElement,
    moveElement,
    moveElementTo,
    findElement,
  };

  return <EditorContext.Provider value={state}>{children}</EditorContext.Provider>;
}

export function useEditorStore(): EditorState {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorStore must be used within EditorProvider');
  }
  return context;
}
