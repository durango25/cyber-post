"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import TiptapImage from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo2,
  Redo2,
  ImagePlus,
  Loader2,
} from "lucide-react";

interface TiptapEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

type ToolbarButton = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  isActive: boolean;
};

export default function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Tulis konten postingan di sini...",
  hasError = false,
}: TiptapEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        underline: false,
      }),
      Underline,
      TiptapImage.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] focus:outline-none p-3",
      },
    },
  });

  // Sync external value (e.g. when form resets with server data)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value ?? "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    // Reset input so same file can be re-selected
    e.target.value = "";
    setUploading(true);
    try {
      // Convert file directly into base64 data URL and embed it in editor content.
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") {
            resolve(result);
            return;
          }
          reject(new Error("Invalid file reader result"));
        };
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      editor.chain().focus().setImage({ src: base64, alt: file.name }).run();
    } catch {
      // Silently ignore failed file reads.
    } finally {
      setUploading(false);
    }
  };

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <UnderlineIcon className="w-4 h-4" />,
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      label: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      label: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <List className="w-4 h-4" />,
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: <Quote className="w-4 h-4" />,
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
  ];

  const charCount = editor.storage.characterCount.characters();

  return (
    <div
      className={`border rounded-box overflow-hidden transition-colors ${hasError
        ? "border-error"
        : "border-base-300 focus-within:border-primary"
        }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-base-300 bg-base-200">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            aria-label={btn.label}
            title={btn.label}
            className={`btn btn-ghost btn-xs btn-square ${btn.isActive ? "btn-active" : ""}`}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px h-5 bg-base-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          aria-label="Horizontal Rule"
          title="Horizontal Rule"
          className="btn btn-ghost btn-xs btn-square"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-base-300 mx-1" />

        {/* Image upload */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          aria-label="Insert Image"
          title="Insert Image"
          className="btn btn-ghost btn-xs btn-square disabled:opacity-30"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4" />
          )}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="w-px h-5 bg-base-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
          title="Undo"
          className="btn btn-ghost btn-xs btn-square disabled:opacity-30"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
          title="Redo"
          className="btn btn-ghost btn-xs btn-square disabled:opacity-30"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor area */}
      <div className="bg-base-100">
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      <div className="px-3 py-1 border-t border-base-300 bg-base-200 text-right">
        <span className="text-xs text-base-content/40">{charCount} karakter</span>
      </div>
    </div>
  );
}
