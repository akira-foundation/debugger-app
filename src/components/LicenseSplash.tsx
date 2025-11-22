import { useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'
import { CachedLicenseValidation } from '../types/license'
import { backendLicenseService } from '../services/backendLicenseService'

interface LicenseSplashProps {
  onValidationComplete: (validation: CachedLicenseValidation | null) => void
  onOpenSettings: () => void
}

export function LicenseSplash({ onValidationComplete, onOpenSettings }: LicenseSplashProps) {
  const [status, setStatus] = useState<'validating' | 'offline' | 'invalid' | 'valid'>('validating')
  const [message, setMessage] = useState('Validating license...')
  const [validation, setValidation] = useState<CachedLicenseValidation | null>(null)
  const [trialWasUsed, setTrialWasUsed] = useState(false)

  useEffect(() => {
    const validateLicense = async () => {
      try {
        setMessage('Validating license...')
        const result = await backendLicenseService.validate()
        setValidation(result)

        // Check if license is valid
        if (result.valid && result.license) {
          setStatus('valid')
          setMessage(
            result.isOnline
              ? '✓ License verified online'
              : `✓ Using cached license (last verified ${new Date(result.validatedAt).toLocaleDateString()})`
          )

          setTimeout(() => {
            onValidationComplete(result)
          }, 1000)
        } else if (!result.isOnline && result.valid) {
          setStatus('offline')
          setMessage('Running in offline mode. License validation skipped.')
          setTimeout(() => {
            onValidationComplete(result)
          }, 2000)
        } else {
          // Check if trial is active
          const isTrial = await backendLicenseService.isTrialActive()
          const wasTrialUsed = await backendLicenseService.trialWasUsed()
          setTrialWasUsed(wasTrialUsed)

          if (isTrial) {
            setStatus('valid')
            const daysRemaining = await backendLicenseService.getTrialDaysRemaining()
            setMessage(`✓ Trial mode (${daysRemaining} days remaining)`)
            setTimeout(() => {
              onValidationComplete(result)
            }, 1000)
          } else {
            setStatus('invalid')
            setMessage('License validation failed')
            setTimeout(() => {
              validateLicense()
            }, 3000)
          }
        }
      } catch (error) {
        setStatus('invalid')
        setMessage(error instanceof Error ? error.message : 'License validation failed')
        setTimeout(() => {
          validateLicense()
        }, 3000)
      }
    }

    validateLicense()
  }, [onValidationComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8">
        {/* Logo/Icon */}
        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-2xl">
          <svg
            className="w-12 h-12 text-white"
            viewBox="0 0 48.7 48.7"
            fill="currentColor"
          >
            <path d="M0,24.35C0,16.8,0,13,1.22,10A16,16,0,0,1,10,1.22C13,0,16.8,0,24.35,0h0C31.9,0,35.71,0,38.72,1.22A16,16,0,0,1,47.48,10c1.22,3,1.22,6.82,1.22,14.37h0c0,7.55,0,11.36-1.22,14.37a16,16,0,0,1-8.76,8.76c-3,1.22-6.82,1.22-14.37,1.22h0C16.8,48.7,13,48.7,10,47.48a16,16,0,0,1-8.76-8.76C0,35.71,0,31.9,0,24.35Z" />
          </svg>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Akira Debugger</h2>

          {/* Loading/Status Animation */}
          <div className="h-1 w-48 bg-gray-700 rounded-full overflow-hidden">
            {status === 'validating' && (
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 animate-pulse" />
            )}
            {status === 'valid' && (
              <div className="h-full bg-green-500 w-full" />
            )}
            {status === 'offline' && (
              <div className="h-full bg-yellow-500 w-full" />
            )}
            {status === 'invalid' && (
              <div className="h-full bg-red-500 w-full" />
            )}
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p
              className={`text-sm font-medium transition-colors ${
                status === 'valid'
                  ? 'text-green-400'
                  : status === 'offline'
                  ? 'text-yellow-400'
                  : status === 'invalid'
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {message}
            </p>

            {status === 'validating' && (
              <p className="text-xs text-gray-500 mt-2">
                {navigator.onLine ? 'Validating online...' : 'Checking cache...'}
              </p>
            )}

          </div>
        </div>

        {/* Offline Mode Notice */}
        {status === 'offline' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 max-w-xs">
            <p className="text-xs text-yellow-300">
              You are offline. The app will continue to work with your last cached license validation.
            </p>
          </div>
        )}

        {/* Error Notice */}
        {status === 'invalid' && (
          <div className="  rounded-lg px-5 py-4 w-80 text-center space-y-3">

            {trialWasUsed ? (
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm cursor-pointer"
              >
                <Settings size={16} />
                Configure License
              </button>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={async () => {
                    await backendLicenseService.activateTrial()
                    window.location.reload()
                  }}
                  className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm cursor-pointer"
                >
                  Try 7 Days For Free
                </button>

                <button
                  onClick={async () => {
                    await invoke('open_url', { url: 'https://packages.akira-io.com/login' })
                  }}
                  className="w-full px-4 py-2 bg-transparent border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-colors text-sm cursor-pointer"
                >
                  Buy a License
                </button>

                <p className="text-xs text-gray-400 pt-1">
                  If you already have a license,{' '}
                  <button
                    onClick={onOpenSettings}
                    className="text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
                  >
                    configure here
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
