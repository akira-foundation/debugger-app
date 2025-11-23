import { CachedLicenseValidation, LicenseStatus } from '../../types/license'

interface LicenseStatusSectionProps {
  validation: CachedLicenseValidation | null
}

export function LicenseStatusSection({ validation }: LicenseStatusSectionProps) {
  if (!validation || !validation.license) return null

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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">License Status</h2>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>

      <div className={`rounded-xl p-6 border backdrop-blur-sm ${getStatusBg(validation.license.status)}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Status</span>
            <span className={`text-sm font-semibold ${getStatusColor(validation.license.status)}`}>
              {validation.license.status.charAt(0).toUpperCase() + validation.license.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">License Type</span>
            <span className="text-sm font-medium text-gray-300">
              {validation.license.type.charAt(0).toUpperCase() + validation.license.type.slice(1)}
            </span>
          </div>

          {validation.license.expiresAt && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Expiration Date</span>
                <span className="text-sm font-mono text-gray-300">
                  {new Date(validation.license.expiresAt).toLocaleDateString()}
                </span>
              </div>

              {validation.daysRemaining !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Days Remaining</span>
                  <span
                    className={`text-sm font-semibold font-mono ${
                      validation.daysRemaining <= 7
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                    }`}
                  >
                    {validation.daysRemaining} {validation.daysRemaining === 1 ? 'day' : 'days'}
                  </span>
                </div>
              )}
            </>
          )}

          <div className="h-px bg-white/5 my-2"></div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Max Activations</span>
            <span className="text-sm font-mono text-gray-300">
              {validation.license.maxActivations}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Last Verified</span>
            <span className="text-xs font-mono text-gray-400">
              {new Date(validation.validatedAt).toLocaleDateString()} at {new Date(validation.validatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
