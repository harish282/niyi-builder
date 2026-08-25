import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';

interface InlineTiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  isSelected: boolean;
  placeholder?: string;
  className?: string;
}

export function InlineTiptapEditor({
  content,
  onUpdate,
  isSelected,
  placeholder = 'Type something...',
  className,
}: InlineTiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content,
    editable: isSelected,
    onUpdate: ({ editor: e }) => {
      onUpdate(e.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.setEditable) {
      editor.setEditable(isSelected);
    }
  }, [editor, isSelected]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content]);

  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      className={className}
    />
  );
}
