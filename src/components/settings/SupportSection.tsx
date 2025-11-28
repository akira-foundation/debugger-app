import { SettingsCard } from './SettingsCard'

export function SupportSection() {
  return (
    <SettingsCard
      title="Support"
      subtitle="Report bugs, request features, or ask for help."
    >
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <a href="mailto:support@akira.app?subject=Bug%20Report" className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-200 text-center">Report a bug</a>
        <a href="mailto:support@akira.app?subject=Feature%20Request" className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-200 text-center">Suggest a feature</a>
        <a href="mailto:support@akira.app?subject=Help%20Request" className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-200 text-center">Get help</a>
      </div>
    </SettingsCard>
  )
}
