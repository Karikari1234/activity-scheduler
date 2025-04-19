'use client';

import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  // Toolbar button styles
  const buttonClass = "p-1 rounded-sm hover:bg-hover focus:outline-none focus:ring-1";
  const activeButtonClass = "bg-hover text-primary";
  
  return (
    <div className="flex flex-wrap gap-1 p-1 border-b">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonClass} ${editor.isActive('bold') ? activeButtonClass : ''}`}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonClass} ${editor.isActive('italic') ? activeButtonClass : ''}`}
        title="Italic"
      >
        <span className="italic">I</span>
      </button>
      
      <div className="h-4 mx-1 border-r my-auto"></div>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonClass} ${editor.isActive('bulletList') ? activeButtonClass : ''}`}
        title="Bullet List"
      >
        • List
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${buttonClass} ${editor.isActive('orderedList') ? activeButtonClass : ''}`}
        title="Numbered List"
      >
        1. List
      </button>
    </div>
  );
}
