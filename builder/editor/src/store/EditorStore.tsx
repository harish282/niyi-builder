import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { LeftPanelId, RightPanelId, ThemeMode } from '../types/index.js';
import type { Breakpoint, BuilderDocument, ElementNode } from '@niyi-builder/core';
import { EventManager, generateId } from '@niyi-builder/core';

const eventManager = new EventManager();

const HISTORY_LIMIT = 100;
const REVISION_LIMIT = 50;

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

/** Deep-clone an element tree, regenerating every id. */
function cloneElementWithNewIds(node: ElementNode): ElementNode {
  return {
    ...node,
    id: generateId(),
    attributes: { ...node.attributes },
    children: node.children.map(cloneElementWithNewIds),
  };
}

function cloneDocument(document: BuilderDocument): BuilderDocument {
  return {
    ...document,
    elements: document.elements.map(cloneElementWithNewIds),
  };
}

interface HistoryState {
  past: BuilderDocument[];
  future: BuilderDocument[];
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
  activeBreakpoint: Breakpoint;
  canUndo: boolean;
  canRedo: boolean;
  hasClipboard: boolean;
  revisions: BuilderDocument[];

  setActiveLeftPanel: (panel: LeftPanelId) => void;
  setActiveRightPanel: (panel: RightPanelId) => void;
  setTheme: (theme: ThemeMode) => void;
  setLoading: (loading: boolean) => void;
  setDocument: (document: BuilderDocument) => void;
  selectElement: (elementId: string | null) => void;
  openWizard: (elementType: string) => void;
  closeWizard: () => void;
  toggleElements: () => void;
  setActiveBreakpoint: (breakpoint: Breakpoint) => void;
  addElement: (element: ElementNode) => void;
  addChildElement: (parentId: string, child: ElementNode) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<ElementNode>) => void;
  moveElement: (elementId: string, newParentId: string) => void;
  moveElementTo: (elementId: string, overId: string) => void;
  duplicateElement: (elementId: string) => void;
  copyElement: (elementId: string) => void;
  pasteElement: (parentId?: string | null) => void;
  undo: () => void;
  redo: () => void;
  createRevision: () => void;
  restoreRevision: (index: number) => void;
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
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('desktop');
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const [hasClipboard, setHasClipboard] = useState(false);
  const [revisions, setRevisions] = useState<BuilderDocument[]>([]);

  const documentRef = useRef(document);
  const historyRef = useRef(history);
  const clipboardRef = useRef<ElementNode | null>(null);

  const setHistoryState = useCallback((next: HistoryState) => {
    historyRef.current = next;
    setHistory(next);
  }, []);

  const commit = useCallback(
    (updater: (prev: BuilderDocument) => BuilderDocument) => {
      const prev = documentRef.current;
      const next = updater(prev);
      if (next === prev) {
        return;
      }
      const past = [...historyRef.current.past, prev].slice(-HISTORY_LIMIT);
      setHistoryState({ past, future: [] });
      documentRef.current = next;
      setDocumentState(next);
    },
    [setHistoryState],
  );

  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const nextHistory = {
      past: past.slice(0, -1),
      future: [documentRef.current, ...future].slice(0, HISTORY_LIMIT),
    };
    documentRef.current = previous;
    setDocumentState(previous);
    setHistoryState(nextHistory);
    eventManager.emit('document.undone', {});
  }, [setHistoryState]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;
    const next = future[0];
    const nextHistory = {
      past: [...past, documentRef.current].slice(-HISTORY_LIMIT),
      future: future.slice(1),
    };
    documentRef.current = next;
    setDocumentState(next);
    setHistoryState(nextHistory);
    eventManager.emit('document.redone', {});
  }, [setHistoryState]);

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
      const prev = documentRef.current;
      const selected = selectedElementId;
      setSelectedElementId(element.id);
      if (selected) {
        const parent = findInTree(prev.elements, selected);
        if (parent) {
          const parentDef = window.__niyiRegistry?.getElement(parent.type);
          if (parentDef?.canHaveChildren) {
            eventManager.emit('element.addedToContainer', {
              parentId: selected,
              child: element,
            });
            commit((current) => ({
              ...current,
              elements: addChildToTree(current.elements, selected, element),
            }));
            return;
          }
        }
      }
      eventManager.emit('element.created', { element });
      commit((current) => ({
        ...current,
        elements: [...current.elements, element],
      }));
    },
    [selectedElementId, commit],
  );

  const addChildElement = useCallback(
    (parentId: string, child: ElementNode) => {
      commit((current) => ({
        ...current,
        elements: addChildToTree(current.elements, parentId, child),
      }));
      eventManager.emit('element.addedToContainer', { parentId, child });
    },
    [commit],
  );

  const removeElement = useCallback(
    (elementId: string) => {
      commit((current) => ({
        ...current,
        elements: removeFromTree(current.elements, elementId),
      }));
      setSelectedElementId((current) => (current === elementId ? null : current));
      eventManager.emit('element.removed', { elementId });
    },
    [commit],
  );

  const updateElement = useCallback(
    (elementId: string, updates: Partial<ElementNode>) => {
      commit((current) => ({
        ...current,
        elements: updateInTree(current.elements, elementId, updates),
      }));
      eventManager.emit('element.updated', { elementId, updates });
    },
    [commit],
  );

  const moveElement = useCallback(
    (elementId: string, newParentId: string) => {
      commit((current) => {
        const element = findInTree(current.elements, elementId);
        if (!element) return current;
        const withoutElement = removeFromTree(current.elements, elementId);
        return {
          ...current,
          elements: addChildToTree(withoutElement, newParentId, element),
        };
      });
      eventManager.emit('element.moved', { elementId, newParentId });
    },
    [commit],
  );

  const moveElementTo = useCallback(
    (elementId: string, overId: string) => {
      commit((current) => {
        if (elementId === overId) return current;
        const active = findInTree(current.elements, elementId);
        if (!active) return current;
        const target = findInTree(current.elements, overId);
        if (!target) return current;
        if (isDescendantOf(current.elements, elementId, overId)) return current;

        const targetDef = window.__niyiRegistry?.getElement(target.type);
        const canNest = Boolean(targetDef?.canHaveChildren);

        const activePos = findInList(current.elements, null, elementId);
        const targetPos = findInList(current.elements, null, overId);
        if (!activePos || !targetPos) return current;

        let newParentId: string | null;
        let insertIndex: number;

        if (canNest) {
          newParentId = overId;
          insertIndex = target.children.length;
        } else {
          newParentId = targetPos.parentId;
          insertIndex = targetPos.index;
        }

        const withoutElement = removeFromTree(current.elements, elementId);
        return {
          ...current,
          elements: insertChildAt(withoutElement, newParentId, active, insertIndex),
        };
      });
      eventManager.emit('element.moved', { elementId, overId });
    },
    [commit],
  );

  const duplicateElement = useCallback(
    (elementId: string) => {
      commit((current) => {
        const element = findInTree(current.elements, elementId);
        if (!element) return current;
        const position = findInList(current.elements, null, elementId);
        if (!position) return current;
        const clone = cloneElementWithNewIds(element);
        return {
          ...current,
          elements: insertChildAt(current.elements, position.parentId, clone, position.index + 1),
        };
      });
      eventManager.emit('element.duplicated', { elementId });
    },
    [commit],
  );

  const copyElement = useCallback((elementId: string) => {
    const element = findInTree(documentRef.current.elements, elementId);
    if (!element) return;
    clipboardRef.current = element;
    setHasClipboard(true);
    eventManager.emit('element.copied', { elementId });
  }, []);

  const pasteElement = useCallback(
    (parentId?: string | null) => {
      const source = clipboardRef.current;
      if (!source) return;
      const clone = cloneElementWithNewIds(source);
      const targetParent = parentId ?? null;
      setSelectedElementId(clone.id);
      commit((current) => {
        const elements =
          targetParent !== null && findInTree(current.elements, targetParent)
            ? addChildToTree(current.elements, targetParent, clone)
            : [...current.elements, clone];
        return { ...current, elements };
      });
      eventManager.emit('element.pasted', { element: clone });
    },
    [commit],
  );

  const setDocument = useCallback(
    (doc: BuilderDocument) => {
      documentRef.current = doc;
      setDocumentState(doc);
      setHistoryState({ past: [], future: [] });
      setSelectedElementId(null);
    },
    [setHistoryState],
  );

  const createRevision = useCallback(() => {
    const snapshot = cloneDocument(documentRef.current);
    setRevisions((current) => [...current, snapshot].slice(-REVISION_LIMIT));
    eventManager.emit('document.revisionCreated', {});
  }, []);

  const restoreRevision = useCallback(
    (index: number) => {
      const snapshot = revisions[index];
      if (!snapshot) return;
      commit(() => cloneDocument(snapshot));
      eventManager.emit('document.revisionRestored', { index });
    },
    [revisions, commit],
  );

  const findElement = useCallback((elementId: string) => {
    return findInTree(documentRef.current.elements, elementId);
  }, []);

  const state: EditorState = {
    activeLeftPanel,
    activeRightPanel,
    theme,
    isLoading,
    document,
    selectedElementId,
    pendingWizard,
    showElements,
    activeBreakpoint,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    hasClipboard,
    revisions,
    setActiveLeftPanel,
    setActiveRightPanel,
    setTheme,
    setLoading,
    setDocument,
    selectElement,
    openWizard,
    closeWizard,
    toggleElements,
    setActiveBreakpoint,
    addElement,
    addChildElement,
    removeElement,
    updateElement,
    moveElement,
    moveElementTo,
    duplicateElement,
    copyElement,
    pasteElement,
    undo,
    redo,
    createRevision,
    restoreRevision,
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
