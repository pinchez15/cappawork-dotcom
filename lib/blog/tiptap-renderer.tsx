import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export function renderTipTapContent(content: any): string {
  if (!content || typeof content !== "object") {
    return "";
  }

  try {
    return generateHTML(content, [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ]);
  } catch (error) {
    console.error("Failed to render TipTap content:", error);
    return "";
  }
}

