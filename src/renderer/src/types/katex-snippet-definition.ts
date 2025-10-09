export interface KatexSnippetDefinition {
  id: string
  label: string
  title?: string
  latex: string
  iconClass?: string
  symbol?: string
  inline?: boolean
  selection?: {
    startOffset: number
    endOffset: number
  }
}
