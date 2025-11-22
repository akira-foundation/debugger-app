import { invoke } from '@tauri-apps/api/core'
import { CachedLicenseValidation } from '../types/license'

export const backendLicenseService = {
  async validate(): Promise<CachedLicenseValidation> {
    return await invoke('validate_license')
  },

  async setLicenseKey(key: string, apiUrl?: string): Promise<void> {
    return await invoke('set_license_key', { key, apiUrl })
  },

  async clearCache(): Promise<void> {
    return await invoke('clear_license_cache')
  },

  async activateTrial(): Promise<void> {
    return await invoke('activate_trial')
  },

  async isTrialActive(): Promise<boolean> {
    return await invoke('is_trial_active')
  },

  async getTrialDaysRemaining(): Promise<number> {
    return await invoke('get_trial_days_remaining')
  },

  async trialWasUsed(): Promise<boolean> {
    return await invoke('trial_was_used')
  },

  async clearTrial(): Promise<void> {
    return await invoke('clear_trial')
  },
}
