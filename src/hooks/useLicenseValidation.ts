import { useState, useCallback } from 'react'
import { CachedLicenseValidation } from '../types/license'
import { backendLicenseService } from '../services/backendLicenseService'

export function useLicenseValidation() {
  const [validation, setValidation] = useState<CachedLicenseValidation | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  const validate = useCallback(async () => {
    setIsValidating(true)
    try {
      const result = await backendLicenseService.validate()
      setValidation(result)
      setIsValid(result.valid && result.license !== null && result.license !== undefined)
    } catch (error) {
      console.error('License validation failed:', error)
      setValidation(null)
      setIsValid(false)
    } finally {
      setIsValidating(false)
    }
  }, [])

  const setLicenseKey = useCallback(async (key: string, apiUrl?: string) => {
    try {
      await backendLicenseService.setLicenseKey(key, apiUrl)
      // Re-validate after setting the key
      await validate()
    } catch (error) {
      console.error('Failed to set license key:', error)
    }
  }, [validate])

  const clearCache = useCallback(async () => {
    try {
      await backendLicenseService.clearCache()
      setValidation(null)
      setIsValid(false)
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [])

  return {
    validation,
    isValidating,
    isValid,
    validate,
    setLicenseKey,
    clearCache,
  }
}
