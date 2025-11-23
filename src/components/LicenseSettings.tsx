import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'
import { CachedLicenseValidation, LicenseStatus } from '../types/license'
import { backendLicenseService } from '../services/backendLicenseService'
import { getAvailableEditors, getInstalledEditors, getPreferredEditor, savePreferredEditor, EditorInfo } from '../services/editorService'

interface LicenseSettingsProps {
  onBack: () => void
  validation: CachedLicenseValidation | null
  onValidationRefresh: () => void
  isValidating: boolean
}

export function LicenseSettings({ onBack, validation, onValidationRefresh }: LicenseSettingsProps) {
  const [licenseKey, setLicenseKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isTrialActive, setIsTrialActive] = useState(false)
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0)
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null)
  const [installedEditors, setInstalledEditors] = useState<EditorInfo[]>([])
  const [preferredEditorId, setPreferredEditorId] = useState<string>('phpstorm')

  useEffect(() => {
    const loadTrialInfo = async () => {
      try {
        const active = await backendLicenseService.isTrialActive()
        const daysRemaining = await backendLicenseService.getTrialDaysRemaining()
        setIsTrialActive(active)
        setTrialDaysRemaining(Number(daysRemaining))
        if (active) {
          const start = new Date()
          start.setDate(start.getDate() - (7 - Number(daysRemaining)))
          setTrialStartDate(start)
        }
      } catch (error) {
        console.error('Failed to load trial info:', error)
      }
    }

    loadTrialInfo()

    const loadEditors = async () => {
      try {
        const installed = await getInstalledEditors()
        const preferred = getPreferredEditor()
        setInstalledEditors(installed)
        setPreferredEditorId(preferred || 'phpstorm')
      } catch (err) {
        console.error('Failed to load editors:', err)
      }
    }
    loadEditors()
  }, [])

  const handleEditorChange = (editorId: string) => {
    try {
      savePreferredEditor(editorId)
      setPreferredEditorId(editorId)
      setMessage({ type: 'success', text: `Editor changed to ${installedEditors.find(e => e.id === editorId)?.name || editorId}` })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to change editor',
      })
    }
  }

  const handleLicenseKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value
    setLicenseKey(key)

    if (key.trim()) {
      setIsSaving(true)
      setMessage(null)
      try {
        await backendLicenseService.setLicenseKey(key)
        setTimeout(() => {
          onValidationRefresh()
        }, 300)
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to save license key',
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleOpenLoginPage = async () => {
    await invoke('open_url', { url: 'https://packages.akira-io.com/login' })
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case LicenseStatus.ACTIVE:
        return 'text-green-400'
      case LicenseStatus.EXPIRED:
        return 'text-red-400'
      case LicenseStatus.SUSPENDED:
        return 'text-yellow-400'
      case LicenseStatus.REVOKED:
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case LicenseStatus.ACTIVE:
        return 'bg-green-500/10 border-green-500/30'
      case LicenseStatus.EXPIRED:
        return 'bg-red-500/10 border-red-500/30'
      case LicenseStatus.SUSPENDED:
        return 'bg-yellow-500/10 border-yellow-500/30'
      case LicenseStatus.REVOKED:
        return 'bg-red-500/10 border-red-500/30'
      default:
        return 'bg-gray-500/10 border-gray-500/30'
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] text-white font-sans">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-2 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] border-b border-white/5 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200"
          title="Back"
        >
          <ArrowLeft size={13} />
        </button>
        <h1 className="text-sm font-semibold">License</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-2xl space-y-6">
          {/* Trial Status */}
          {isTrialActive && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Trial Mode</h2>

              <div className="border rounded-lg p-6 bg-yellow-500/10 border-yellow-500/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-sm font-semibold text-yellow-400">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Days Remaining</span>
                    <span className={`text-sm font-mono font-semibold ${
                      trialDaysRemaining <= 2 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {trialDaysRemaining} days
                    </span>
                  </div>

                  {trialStartDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Started</span>
                      <span className="text-sm font-mono text-gray-300">
                        {trialStartDate.toLocaleDateString()}{' '}
                        {trialStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* License Status */}
          {validation && validation.license && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Status</h2>

              <div className={`border rounded-lg p-6 ${getStatusBg(validation.license.status)}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`text-sm font-semibold ${getStatusColor(validation.license.status)}`}>
                      {validation.license.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-sm font-mono text-gray-300">
                      {validation.license.type.toUpperCase()}
                    </span>
                  </div>

                  {validation.license.expiresAt && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Expires</span>
                        <span className="text-sm font-mono text-gray-300">
                          {new Date(validation.license.expiresAt).toLocaleDateString()}
                        </span>
                      </div>

                      {validation.daysRemaining !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Days Remaining</span>
                          <span
                            className={`text-sm font-mono font-semibold ${
                              validation.daysRemaining <= 7
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            {validation.daysRemaining} days
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Validations</span>
                    <span className="text-sm font-mono text-gray-300">
                      {validation.license.maxActivations} max
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Last Verified</span>
                    <span className="text-sm font-mono text-gray-300">
                      {new Date(validation.validatedAt).toLocaleDateString()}{' '}
                      {new Date(validation.validatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* License Key Input */}
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
              <p className="text-xs text-blue-300 font-medium">How to get your license key:</p>
              <ol className="text-xs text-blue-300 space-y-1 list-decimal list-inside">
                <li>Go to your account at packages.akira-io.com</li>
                <li>Copy your license key</li>
                <li>Paste it in the field below</li>
              </ol>
              <button
                onClick={handleOpenLoginPage}
                className="w-full mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Open packages.akira-io.com
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">License Key</label>
              <input
                type="password"
                value={licenseKey}
                onChange={handleLicenseKeyChange}
                placeholder="Paste your license key here"
                disabled={isSaving}
                className="w-full px-3 py-2 bg-[#0f0f0f] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-mono text-sm disabled:opacity-50"
              />
            </div>

            {message && (
              <div
                className={`px-3 py-2 rounded-lg text-xs ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            {isSaving && (
              <div className="px-3 py-2 rounded-lg text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Validating license...
              </div>
            )}
          </div>

          {/* Editor Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Editor Settings</h2>

            <div className="border rounded-lg p-6 bg-white/5 border-white/10 space-y-4">
              {installedEditors.length > 0 ? (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">Preferred Editor</label>
                  <select
                    value={preferredEditorId}
                    onChange={(e) => handleEditorChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f0f0f] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-mono text-sm cursor-pointer h-9"
                  >
                    {installedEditors.map((editor) => (
                      <option key={editor.id} value={editor.id}>
                        {editor.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {installedEditors.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Detected Editors</p>
                  <div className="flex flex-wrap gap-2">
                    {installedEditors.map((editor) => (
                      <span
                        key={editor.id}
                        className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium"
                      >
                        {editor.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {installedEditors.length === 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-gray-500">No editors detected. Install VSCode, PhpStorm, or Cursor to use this feature.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
