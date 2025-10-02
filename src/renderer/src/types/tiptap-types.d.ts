// tiptap-types.d.ts
// Custom types for TipTap configuration gaps

export type TiptapDocumentConfig = false | { content: string }

// Shared image attribute shape used by ResizableImage extension
export interface LunaImageAttrs {
  src?: string | null
  alt?: string | null
  title?: string | null
  width?: number | null
  height?: number | null
  originalWidth?: number | null
  originalHeight?: number | null
}
