"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import "./rich-text-styles.css";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { RichTextContent } from "@/types/schedule";
import { EditorToolbar } from "./EditorToolbar";

interface RichTextEditorProps {
  content: RichTextContent | null;
  onChange?: (content: RichTextContent) => void;
  placeholder?: string;
  readOnly?: boolean;
  id?: string;
  name?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  id,
  name,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit extensions as needed
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
    ],
    content: content || {
      type: "doc",
      content: [{ type: "paragraph", content: [] }],
    },
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onChange) {
        // Get the JSON content and cast it to our type
        const jsonContent = editor.getJSON() as RichTextContent;
        onChange(jsonContent);
      }
    },
    editorProps: {
      attributes: {
        class:
          "p-sm focus:outline-none min-h-[100px] prose prose-sm max-w-none text-text-primary",
        ...(id ? { id } : {}), // Conditionally include the `id` attribute
        "data-placeholder": placeholder,
      },
    },
  });

  // Update content from props when it changes externally
  useEffect(() => {
    if (editor && content && editor.isEditable) {
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  return (
    <div className="border border-divider rounded-md overflow-hidden bg-input-bg">
      {!readOnly && editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className="rich-text-content" />

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={editor ? JSON.stringify(editor.getJSON()) : ""}
        />
      )}
    </div>
  );
}
