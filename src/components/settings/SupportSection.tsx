import { invoke } from '@tauri-apps/api/core'
import { SettingsCard } from './SettingsCard'

export function SupportSection() {
  const openEmail = async (subject: string) => {
    const url = `mailto:kidiatoliny@gmail.com?subject=${encodeURIComponent(subject)}`
    try {
      await invoke('open_url', { url })
    } catch (e) {
      console.error('Failed to open email client:', e)
    }
  }

  return (
    <SettingsCard
      title="Support"
      subtitle="Report bugs, request features, or ask for help."
    >
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <button onClick={() => openEmail('Bug Report')} className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-200 text-center cursor-pointer">Report a bug</button>
        <button onClick={() => openEmail('Feature Request')} className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-200 text-center cursor-pointer">Suggest a feature</button>
        <button onClick={() => openEmail('Help Request')} className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-200 text-center cursor-pointer">Get help</button>
      </div>
    </SettingsCard>
  )
}
