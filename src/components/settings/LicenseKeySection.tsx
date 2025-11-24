import { invoke } from '@tauri-apps/api/core'
import { backendLicenseService } from '../../services/backendLicenseService'
import { SettingsCard } from './SettingsCard'

interface LicenseKeySectionProps {
  licenseKey: string
  isSaving: boolean
  onLicenseKeyChange: (key: string) => void
  onValidationRefresh: () => void
}

export function LicenseKeySection({
  licenseKey,
  isSaving,
  onLicenseKeyChange,
  onValidationRefresh,
}: LicenseKeySectionProps) {
  const handleOpenLoginPage = async () => {
    await invoke('open_url', { url: 'https://packages.akira-io.com/login' })
  }

  const handleLicenseKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value
    onLicenseKeyChange(key)

    if (key.trim()) {
      try {
        await backendLicenseService.setLicenseKey(key)
        setTimeout(() => {
          onValidationRefresh()
        }, 300)
      } catch (error) {
        console.error('Failed to save license key:', error)
      }
    }
  }

  return (
    <SettingsCard title="Add License Key" subtitle="Paste your license key to activate premium features">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-300 font-medium">Steps to activate your license:</p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Visit your account at packages.akira-io.com</li>
            <li>Copy your unique license key</li>
            <li>Paste it in the field below</li>
          </ol>
        </div>
        <button
          onClick={handleOpenLoginPage}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer shadow-lg shadow-purple-500/20"
        >
          Open Account
        </button>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">License Key</label>
          <input
            type="password"
            value={licenseKey}
            onChange={handleLicenseKeyChange}
            placeholder="Paste your license key here"
            disabled={isSaving}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-mono text-sm disabled:opacity-50 transition-colors"
          />
        </div>

        {isSaving && (
          <div className="px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-500/10 border border-purple-500/30 text-purple-300">
            Validating your license key...
          </div>
        )}
      </div>
    </SettingsCard>
  )
}
