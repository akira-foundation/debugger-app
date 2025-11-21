export enum LicenseStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
}

export enum LicenseType {
  LIFETIME = 'lifetime',
  ANNUAL = 'annual',
  SUBSCRIPTION = 'subscription',
  TRIAL = 'trial',
  CREDITS = 'credits',
}

export enum LicenseEventType {
  CREATED = 'created',
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
  ROTATED = 'rotated',
  REVOKED = 'revoked',
  USAGE_CONSUMED = 'usage_consumed',
  EXPIRED = 'expired',
  ABUSE_DETECTED = 'abuse_detected',
}

export interface License {
  id: string
  key: string
  type: LicenseType
  status: LicenseStatus
  maxActivations: number
  maxSeats: number
  fallback: boolean
  scopes?: string[]
  meta?: Record<string, any>
  expiresAt?: string
  graceEndsAt?: string
  createdAt: string
  updatedAt: string
}

export interface LicenseActivation {
  id: string
  licenseId: string
  domain?: string
  machineHash?: string
  ip?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

export interface LicenseUsage {
  id: string
  licenseId: string
  consumedUnits: number
  limit: number
  createdAt: string
  updatedAt: string
}

export interface LicenseValidationResponse {
  valid: boolean
  license?: License
  activation?: LicenseActivation
  usage?: LicenseUsage
  daysRemaining?: number
  message?: string
}

export interface CachedLicenseValidation {
  valid: boolean
  license?: License
  daysRemaining?: number
  validatedAt: string
  expiresAt: string
  isOnline: boolean
}

export interface LicenseConfig {
  licenseKey?: string
  apiUrl: string
  cacheExpireHours: number
}
