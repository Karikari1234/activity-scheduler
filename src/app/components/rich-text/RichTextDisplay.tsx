"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import "./rich-text-styles.css";
import StarterKit from "@tiptap/starter-kit";
import { RichTextContent } from "@/types/schedule";

interface RichTextDisplayProps {
  content: RichTextContent | null;
  className?: string;
}

export default function RichTextDisplay({
  content,
  className = "",
}: RichTextDisplayProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || {
      type: "doc",
      content: [{ type: "paragraph", content: [] }],
    },
    editable: false,
  });

  if (!content) {
    return (
      <div className={`italic text-text-secondary ${className}`}>
        No content
      </div>
    );
  }

  return (
    <div className={`rich-text-display prose prose-sm max-w-none text-text-primary ${className}`}>
      <EditorContent editor={editor} />
    </div>
  );
}
