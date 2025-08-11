export type WorkspaceLayoutMode = 'fluid' | 'a4Preview'
export const WORKSPACE_LAYOUT_MODES: WorkspaceLayoutMode[] = ['fluid', 'a4Preview']

export interface MenubarState {
  workspaceLayoutMode: WorkspaceLayoutMode
}
