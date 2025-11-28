import { EditorInfo } from '../../services/editorService'
import { SettingsCard } from './SettingsCard'
import { SettingsButton } from './SettingsButton'

interface EditorSectionProps {
  installedEditors: EditorInfo[]
  preferredEditorId: string
  message: { type: 'success' | 'error'; text: string } | null
  onEditorChange: (editorId: string) => void
}

export function EditorSection({
  installedEditors,
  preferredEditorId,
  message,
  onEditorChange,
}: EditorSectionProps) {
  return (
    <SettingsCard title="Preferred Editor" subtitle="Supported editors are detected automatically on your system">
      <div className="space-y-5">
        {installedEditors.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {installedEditors.map((editor) => (
                <SettingsButton
                  key={editor.id}
                  onClick={() => onEditorChange(editor.id)}
                  isActive={preferredEditorId === editor.id}
                >
                  {editor.name}
                </SettingsButton>
              ))}
            </div>

            {message && (
              <div
                className={`px-4 py-2.5 rounded-lg text-sm font-medium mt-3 ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        ) : null}

        {installedEditors.length === 0 && (
          <div>
            <p className="text-sm text-gray-400">No editors detected on your system. Install VSCode, PhpStorm, or Cursor to enable this feature.</p>
          </div>
        )}
      </div>
    </SettingsCard>
  )
}
