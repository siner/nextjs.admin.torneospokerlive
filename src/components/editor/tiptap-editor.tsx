"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading2 as Heading2Icon,
  Heading3 as Heading3Icon,
  Pilcrow as PilcrowIcon,
  Link as LinkIcon,
} from "lucide-react"; // Usar iconos de lucide
import { Toggle } from "@/components/ui/toggle"; // Usar Toggle de shadcn para botones
import React, { useCallback } from "react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
}

// Componente de la barra de herramientas
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e: any) {
      alert(e.message);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex flex-wrap gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Negrita"
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Cursiva"
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        aria-label="Encabezado 2"
      >
        <Heading2Icon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        aria-label="Encabezado 3"
      >
        <Heading3Icon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={setLink}
        aria-label="Enlace"
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none rounded-b-md border border-input bg-background px-3 py-2 min-h-[150px]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      // console.log(editor.getHTML()); // Log para debug
    },
    immediatelyRender: false,
  });

  return (
    <div className="flex flex-col justify-stretch">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
