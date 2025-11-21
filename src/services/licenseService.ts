import {
  License,
  LicenseStatus,
  LicenseConfig,
  CachedLicenseValidation,
  LicenseValidationResponse,
} from '../types/license'

const CACHE_KEY = 'akira_license_validation'
const CONFIG_KEY = 'akira_license_config'
const TRIAL_START_KEY = 'akira_trial_start'
const TRIAL_USED_KEY = 'akira_trial_used'
const CACHE_EXPIRY_HOURS = 24

class LicenseService {
  private config: LicenseConfig = {
    apiUrl: 'https://packages.akira-io.com/api/licenses',
    cacheExpireHours: 24,
  }

  constructor() {
    this.loadConfig()
  }

  private loadConfig(): void {
    const stored = localStorage.getItem(CONFIG_KEY)
    if (stored) {
      this.config = { ...this.config, ...JSON.parse(stored) }
    }
  }

  setLicenseKey(key: string, apiUrl?: string): void {
    this.config.licenseKey = key
    if (apiUrl) this.config.apiUrl = apiUrl
    localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config))
  }

  private getCachedValidation(): CachedLicenseValidation | null {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const validation: CachedLicenseValidation = JSON.parse(cached)
    const expiresAt = new Date(validation.expiresAt)
    const now = new Date()

    if (now <= expiresAt) {
      return validation
    }
    localStorage.removeItem(CACHE_KEY)
    return null
  }

  private cacheValidation(response: LicenseValidationResponse, isOnline: boolean): void {
    const now = new Date()
    // Cache expira em 24 horas
    const cacheExpiresAt = new Date(now.getTime() + CACHE_EXPIRY_HOURS * 60 * 60 * 1000)
    // Licença expira na data definida pelo servidor
    const licenseExpiresAt = new Date(now.getTime() + this.config.cacheExpireHours * 60 * 60 * 1000)

    const cached: any = {
      valid: response.valid,
      license: response.license,
      daysRemaining: response.daysRemaining,
      validatedAt: now.toISOString(),
      expiresAt: licenseExpiresAt.toISOString(),
      cacheExpiresAt: cacheExpiresAt.toISOString(),
      isOnline,
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  }

  private isCacheExpired(cached: any): boolean {
    const now = new Date()
    const cacheExpiresAt = new Date(cached.cacheExpiresAt)
    return now > cacheExpiresAt
  }

  private isOnline(): boolean {
    return navigator.onLine
  }


  private async validateOnline(): Promise<LicenseValidationResponse> {
    if (!this.config.licenseKey) {
      return { valid: false, message: 'No license key configured' }
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: this.config.licenseKey,
          machineHash: await this.getMachineHash(),
          userAgent: navigator.userAgent,
        }),
      })

      if (!response.ok) {
        return {
          valid: false,
          message: `Validation failed: ${response.statusText}`,
        }
      }

      return await response.json()
    } catch (error) {
      console.error('License validation error:', error)
      return {
        valid: false,
        message: error instanceof Error ? error.message : 'Validation error',
      }
    }
  }

  private async getMachineHash(): Promise<string> {
    const userAgent = navigator.userAgent
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const data = `${userAgent}${timezone}`
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  async validate(): Promise<CachedLicenseValidation> {
    // Se está online, SEMPRE valida com servidor
    if (this.isOnline()) {
      const onlineResponse = await this.validateOnline()

      if (onlineResponse.valid) {
        this.cacheValidation(onlineResponse, true)
        return {
          valid: true,
          license: onlineResponse.license,
          daysRemaining: onlineResponse.daysRemaining,
          validatedAt: new Date().toISOString(),
          expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
          isOnline: true,
        }
      }
    }

    // Offline: tenta usar cache
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (cached && !this.isCacheExpired(cached)) {
      return { ...cached, isOnline: false }
    }

    // Cache expirou ou não existe
    return {
      valid: false,
      validatedAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
      isOnline: false,
    }
  }

  getValidation(): CachedLicenseValidation | null {
    return this.getCachedValidation()
  }

  clearCache(): void {
    localStorage.removeItem(CACHE_KEY)
  }

  isValid(validation: CachedLicenseValidation): boolean {
    if (!validation.valid) return false
    if (!validation.license) return false

    if (validation.license.expiresAt) {
      const expiresAt = new Date(validation.license.expiresAt)
      if (expiresAt < new Date()) return false
    }

    return validation.license.status === LicenseStatus.ACTIVE;

  }

  getErrorMessage(validation: CachedLicenseValidation): string {
    if (!validation.license) {
      return 'No valid license found'
    }

    if (!validation.isOnline && validation.valid) {
      return `Running offline. Last validated: ${new Date(validation.validatedAt).toLocaleDateString()}`
    }

    switch (validation.license.status) {
      case LicenseStatus.EXPIRED:
        return 'License has expired'
      case LicenseStatus.SUSPENDED:
        return 'License has been suspended'
      case LicenseStatus.REVOKED:
        return 'License has been revoked'
      default:
        return 'Invalid license'
    }
  }

  // Trial methods
  activateTrial(): void {
    const trialUsed = localStorage.getItem(TRIAL_USED_KEY)

    if (trialUsed) {
      throw new Error('Trial já foi utilizado neste dispositivo')
    }

    localStorage.setItem(TRIAL_USED_KEY, 'true')
    localStorage.setItem(TRIAL_START_KEY, new Date().toISOString())
  }

  isTrialActive(): boolean {
    const trialStart = localStorage.getItem(TRIAL_START_KEY)
    if (!trialStart) return false

    const startDate = new Date(trialStart)
    const now = new Date()
    const daysElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

    return daysElapsed < 7
  }

  getTrialDaysRemaining(): number {
    const trialStart = localStorage.getItem(TRIAL_START_KEY)
    if (!trialStart) return 0

    const startDate = new Date(trialStart)
    const now = new Date()
    const daysElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

    return Math.max(0, Math.ceil(7 - daysElapsed))
  }

  getTrialUsed(): boolean {
    return !!localStorage.getItem(TRIAL_USED_KEY)
  }

  clearTrial(): void {
    localStorage.removeItem(TRIAL_START_KEY)
    localStorage.removeItem(TRIAL_USED_KEY)
  }
}

export const licenseService = new LicenseService()
