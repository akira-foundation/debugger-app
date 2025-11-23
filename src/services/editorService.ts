import { invoke } from '@tauri-apps/api/core'

export interface EditorInfo {
  id: string
  name: string
}

export async function getAvailableEditors(): Promise<EditorInfo[]> {
  const editors = await invoke<[string, string][]>('get_available_editors')
  return editors.map(([id, name]) => ({ id, name }))
}

export async function getInstalledEditors(): Promise<EditorInfo[]> {
  const editors = await invoke<[string, string][]>('get_installed_editors')
  return editors.map(([id, name]) => ({ id, name }))
}

export async function checkEditorInstalled(editorId: string): Promise<boolean> {
  return await invoke<boolean>('check_editor_installed', { editor_id: editorId })
}

export async function openInEditorV2(filePath: string, line: number, editorId: string): Promise<void> {
  return await invoke('open_in_editor_v2', {
    file_path: filePath,
    line,
    editor_id: editorId,
  })
}

export function getPreferredEditor(): string | null {
  return localStorage.getItem('preferred_editor')
}

export function savePreferredEditor(editorId: string): void {
  localStorage.setItem('preferred_editor', editorId)
}
