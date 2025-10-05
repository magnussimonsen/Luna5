import Image from '@tiptap/extension-image'
import type { NodeViewRenderer } from '@tiptap/core'

// Attributes persisted on the image node.
export interface LunaImageAttrs {
  src?: string | null
  alt?: string | null
  title?: string | null
  width?: number | null // explicit user width (px)
  height?: number | null // explicit user height (px) only when freeform resized
  originalWidth?: number | null // natural image width captured once
  originalHeight?: number | null // natural image height captured once
}

// Injects lightweight styles exactly once (scoped to document, avoids global stylesheet churn)
function ensureStylesInjected(): void {
  if (document.getElementById('luna-resizable-image-styles')) return
  const styleElement = document.createElement('style')
  styleElement.id = 'luna-resizable-image-styles'
  styleElement.textContent = `
  .resizable-image-wrapper { position: relative; display: inline-block; max-width: 100%; }
  .resizable-image-wrapper.is-resizing { opacity: .85; }
  .resizable-image { max-width: 100%; height: auto; display: block; user-select: none; }
  .resize-handle { position: absolute; width: 12px; height: 12px; right: 2px; bottom: 2px; cursor: se-resize; background: var(--color-accent, #3d82f6); border: 1px solid #fff; border-radius: 2px; box-shadow: 0 0 2px rgba(0,0,0,.4); }
  html.is-resizing-image, html.is-resizing-image * { user-select: none !important; }
  `
  document.head.appendChild(styleElement)
}

export const ResizableImage = Image.extend({
  addAttributes() {
    // access parent attributes (src/alt/title) without losing default behavior
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parentAttributes = (this as any).parent?.() || {}
    return {
      ...parentAttributes,
      width: { default: null },
      height: { default: null },
      originalWidth: { default: null },
      originalHeight: { default: null }
    }
  },
  addNodeView(): NodeViewRenderer {
    return ({ node, getPos, editor }) => {
      ensureStylesInjected()
      const imageAttributes = node.attrs as LunaImageAttrs

      // DOM elements
      const wrapperElement = document.createElement('span')
      wrapperElement.className = 'resizable-image-wrapper'

      const imageElement = document.createElement('img')
      imageElement.className = 'resizable-image'
      imageElement.draggable = false
      if (imageAttributes.src) imageElement.src = String(imageAttributes.src)
      if (imageAttributes.alt) imageElement.alt = String(imageAttributes.alt)
      if (imageAttributes.title) imageElement.title = String(imageAttributes.title)
      if (imageAttributes.width) imageElement.style.width = imageAttributes.width + 'px'
      if (imageAttributes.height) imageElement.style.height = imageAttributes.height + 'px'
      wrapperElement.appendChild(imageElement)

      const resizeHandleElement = document.createElement('span')
      resizeHandleElement.className = 'resize-handle'
      resizeHandleElement.title = 'Drag to resize (Shift = freeform)'
      wrapperElement.appendChild(resizeHandleElement)

      // Drag interaction state
      let dragStartClientX = 0
      let dragStartClientY = 0
      let initialWidth = 0
      let initialHeight = 0
      let currentAspectRatio = 1
      let isFreeformResizing = false

      // Persist current sizing + optional extra attributes back into the ProseMirror node
      const persistNodeAttributes = (extra: Partial<LunaImageAttrs> = {}): void => {
        try {
          const nodePosition = getPos?.()
          if (typeof nodePosition !== 'number') return
          const parsedWidth = parseInt(imageElement.style.width, 10) || null
          const parsedHeight = parseInt(imageElement.style.height, 10) || null
          const transaction = editor.state.tr
          transaction.setNodeMarkup(nodePosition, undefined, {
            ...node.attrs,
            width: parsedWidth,
            height: isFreeformResizing ? parsedHeight : null,
            ...extra
          })
          editor.view.dispatch(transaction)
        } catch (error) {
          console.warn('[ResizableImage] persist failed', error)
        }
      }

      // Clamp oversized images to container width (prevents layout breakage)
      const clampIfOversized = (): void => {
        try {
          const parentRect = wrapperElement.parentElement?.getBoundingClientRect()
          if (!parentRect) return
          const displayedWidth = imageElement.getBoundingClientRect().width
          if (displayedWidth > parentRect.width) {
            const clamped = Math.round(parentRect.width)
            imageElement.style.width = clamped + 'px'
            persistNodeAttributes({ width: clamped })
          }
        } catch {
          /* intentionally ignored */
        }
      }

      // Capture natural size only once
      if (!imageAttributes.originalWidth || !imageAttributes.originalHeight) {
        imageElement.addEventListener('load', () => {
          persistNodeAttributes({
            originalWidth: imageElement.naturalWidth,
            originalHeight: imageElement.naturalHeight
          })
          clampIfOversized()
        })
      } else {
        // Defer to allow parent layout to settle
        setTimeout(clampIfOversized, 0)
      }

      const handleMouseDown = (mouseEvent: MouseEvent): void => {
        mouseEvent.preventDefault()
        mouseEvent.stopPropagation()
        const rect = imageElement.getBoundingClientRect()
        dragStartClientX = mouseEvent.clientX
        dragStartClientY = mouseEvent.clientY
        initialWidth = rect.width
        initialHeight = rect.height
        currentAspectRatio = initialHeight / (initialWidth || 1)
        isFreeformResizing = false
        document.documentElement.classList.add('is-resizing-image')
        wrapperElement.classList.add('is-resizing')
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
      }

      const handleMouseMove = (mouseEvent: MouseEvent): void => {
        const deltaX = mouseEvent.clientX - dragStartClientX
        const deltaY = mouseEvent.clientY - dragStartClientY
        const computedWidth = Math.max(48, Math.round(initialWidth + deltaX))
        let computedHeight = Math.round(computedWidth * currentAspectRatio)
        if (mouseEvent.shiftKey) {
          // user explicitly overrides aspect ratio
          isFreeformResizing = true
          computedHeight = Math.max(48, Math.round(initialHeight + deltaY))
        }
        imageElement.style.width = computedWidth + 'px'
        imageElement.style.height = computedHeight + 'px'
      }

      const handleMouseUp = (): void => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        document.documentElement.classList.remove('is-resizing-image')
        wrapperElement.classList.remove('is-resizing')
        persistNodeAttributes()
      }

      resizeHandleElement.addEventListener('mousedown', handleMouseDown)

      return {
        dom: wrapperElement,
        destroy() {
          resizeHandleElement.removeEventListener('mousedown', handleMouseDown)
        },
        update(updatedNode) {
          if (updatedNode.type.name !== 'image') return false
          const updatedAttributes = updatedNode.attrs as LunaImageAttrs
          if (updatedAttributes.src && updatedAttributes.src !== imageElement.src) {
            imageElement.src = String(updatedAttributes.src)
          }
          if (updatedAttributes.alt) {
            imageElement.alt = String(updatedAttributes.alt)
          } else {
            imageElement.removeAttribute('alt')
          }
          if (updatedAttributes.title) {
            imageElement.title = String(updatedAttributes.title)
          } else {
            imageElement.removeAttribute('title')
          }
          if (updatedAttributes.width) {
            imageElement.style.width = updatedAttributes.width + 'px'
          } else {
            imageElement.style.removeProperty('width')
          }
          if (updatedAttributes.height) {
            imageElement.style.height = updatedAttributes.height + 'px'
          } else {
            imageElement.style.removeProperty('height')
          }
          return true
        }
      }
    }
  }
})

export default ResizableImage
