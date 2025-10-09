export interface KatexSnippetDefinition {
  id: string
  label: string
  title?: string
  latex: string
  iconClass?: string
  symbol?: string
  selection?: {
    startOffset: number
    endOffset: number
  }
}
