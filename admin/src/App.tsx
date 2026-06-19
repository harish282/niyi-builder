import { EditorLayout } from '@niyi-builder/editor';
import { EditorProvider } from '@niyi-builder/editor';

export function App() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
