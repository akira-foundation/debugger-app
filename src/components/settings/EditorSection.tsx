import { EditorInfo } from '../../services/editorService'

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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Editor Settings</h2>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>

      <div className="rounded-xl p-6 bg-gradient-to-br from-white/2 to-transparent border border-white/10 backdrop-blur-sm space-y-5">
        <p className="text-xs text-gray-500">Supported editors are detected automatically on your system</p>

        {installedEditors.length > 0 ? (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Preferred Editor</label>
            <div className="flex flex-wrap gap-2">
              {installedEditors.map((editor) => (
                <button
                  key={editor.id}
                  onClick={() => onEditorChange(editor.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    preferredEditorId === editor.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 text-purple-300 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/50'
                  }`}
                >
                  {editor.name}
                </button>
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
    </section>
  )
}
