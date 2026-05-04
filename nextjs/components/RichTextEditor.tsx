"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  hasError?: boolean;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  hasError,
  placeholder = "Write your content here...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-48 p-3 outline-none",
      },
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. edit mode loading data after mount)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, {});
    }
  }, [editor, value]);

  return (
    <div
      className={`border rounded-lg overflow-hidden bg-base-100 ${hasError ? "border-error" : "border-base-300"
        }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-base-300 bg-base-200">
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          title="Bold"
        >
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          title="Italic"
        >
          <Italic size={14} />
        </ToolBtn>
        <div className="divider divider-horizontal mx-0.5 my-0.5" />
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor?.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </ToolBtn>
        <div className="divider divider-horizontal mx-0.5 my-0.5" />
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title="Ordered list"
        >
          <ListOrdered size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus size={14} />
        </ToolBtn>
        <div className="divider divider-horizontal mx-0.5 my-0.5" />
        <ToolBtn
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          title="Undo"
        >
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          title="Redo"
        >
          <Redo size={14} />
        </ToolBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Toolbar button helper ────────────────────────────────────────────────────

function ToolBtn({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-xs btn-ghost px-2 ${active ? "btn-active" : ""}`}
    >
      {children}
    </button>
  );
}
