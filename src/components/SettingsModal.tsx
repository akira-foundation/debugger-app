import { useState } from 'react'
import { X, Save, Trash2, Copy, Check, RefreshCw } from 'lucide-react'
import { CachedLicenseValidation, LicenseStatus } from '../types/license'
import { licenseService } from '../services/licenseService'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  validation: CachedLicenseValidation | null
  onValidationRefresh: () => void
}

export function SettingsModal({
  isOpen,
  onClose,
  validation,
  onValidationRefresh,
}: SettingsModalProps) {
  const [licenseKey, setLicenseKey] = useState('')
  const [apiUrl, setApiUrl] = useState('https://packages.akira-io.com/api/licenses')
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    if (!licenseKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter a license key' })
      return
    }

    setIsSaving(true)
    try {
      licenseService.setLicenseKey(licenseKey, apiUrl)
      setMessage({ type: 'success', text: 'License key saved successfully!' })
      setTimeout(() => {
        onValidationRefresh()
      }, 500)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save license key',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the license cache?')) {
      licenseService.clearCache()
      setMessage({ type: 'success', text: 'License cache cleared' })
      setTimeout(() => {
        onValidationRefresh()
      }, 500)
    }
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-lg border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0f0f1a]">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Messages */}
          {message && (
            <div
              className={`px-4 py-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* License Status */}
          {validation && validation.license && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">License Status</h3>

              <div className={`border rounded-lg p-4 ${getStatusBg(validation.license.status)}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span
                      className={`text-sm font-semibold ${getStatusColor(validation.license.status)}`}
                    >
                      {validation.license.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Type</span>
                    <span className="text-sm font-mono text-gray-300">
                      {validation.license.type.toUpperCase()}
                    </span>
                  </div>

                  {validation.license.expiresAt && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Expires At</span>
                        <span className="text-sm font-mono text-gray-300">
                          {new Date(validation.license.expiresAt).toLocaleDateString()}
                        </span>
                      </div>

                      {validation.daysRemaining !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Days Remaining</span>
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
                    <span className="text-gray-400 text-sm">Validations</span>
                    <span className="text-sm font-mono text-gray-300">
                      {validation.license.maxActivations} max
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Last Verified</span>
                    <span className="text-sm font-mono text-gray-300">
                      {new Date(validation.validatedAt).toLocaleDateString()}{' '}
                      {new Date(validation.validatedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Mode</span>
                    <span
                      className={`text-sm font-mono ${
                        validation.isOnline ? 'text-green-400' : 'text-yellow-400'
                      }`}
                    >
                      {validation.isOnline ? 'Online' : 'Offline (Cached)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* License Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">License Configuration</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  License Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Enter your license key"
                    className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="p-2 bg-black/30 hover:bg-black/50 border border-white/10 rounded-lg transition-colors"
                    title="Copy key"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API URL</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://packages.akira-io.com/api/licenses"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-mono text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save License Key'}
            </button>
          </div>

          {/* Cache Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Cache Management</h3>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                The app caches your license validation for offline use. You can clear this cache
                to force a new online validation.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={onValidationRefresh}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  Re-validate License
                </button>

                <button
                  onClick={handleClearCache}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-medium rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Clear Cache
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-xs text-blue-300">
              <strong>Note:</strong> Your license key is stored locally and never transmitted to our
              servers except during validation. For security, always use HTTPS for the API URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
