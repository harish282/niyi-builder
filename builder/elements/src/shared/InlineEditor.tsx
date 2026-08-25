import { useRef, useEffect, useCallback } from 'react';

interface InlineEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  isSelected: boolean;
  placeholder?: string;
}

export function InlineEditor({
  content,
  onUpdate,
  isSelected,
  placeholder = 'Type something...',
}: InlineEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastSaved = useRef(content);

  useEffect(() => {
    if (ref.current && !isSelected) {
      ref.current.innerHTML = content;
      lastSaved.current = content;
    }
  }, [content, isSelected]);

  useEffect(() => {
    if (ref.current && isSelected) {
      ref.current.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isSelected]);

  const handleInput = useCallback(() => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    if (html !== lastSaved.current) {
      lastSaved.current = html;
      onUpdate(html);
    }
  }, [onUpdate]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent Enter from creating new block elements — just allow default behavior
    // but strip any <p> or <div> that contentEditable might create
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak', false);
    }
  }, []);

  const showPlaceholder = isSelected && (!content || content === '<br>');

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className="outline-none min-h-[1em] inline"
      data-placeholder={showPlaceholder ? placeholder : undefined}
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      style={{
        display: 'inline',
        outline: 'none',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    />
  );
}
