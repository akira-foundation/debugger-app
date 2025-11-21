import { useState, useCallback } from 'react'
import { CachedLicenseValidation } from '../types/license'
import { licenseService } from '../services/licenseService'

export function useLicenseValidation() {
  const [validation, setValidation] = useState<CachedLicenseValidation | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  const validate = useCallback(async () => {
    setIsValidating(true)
    try {
      const result = await licenseService.validate()
      setValidation(result)
      setIsValid(licenseService.isValid(result))
    } catch (error) {
      console.error('License validation failed:', error)
      setValidation(null)
      setIsValid(false)
    } finally {
      setIsValidating(false)
    }
  }, [])

  const setLicenseKey = useCallback((key: string, apiUrl?: string) => {
    licenseService.setLicenseKey(key, apiUrl)
  }, [])

  const clearCache = useCallback(() => {
    licenseService.clearCache()
    setValidation(null)
    setIsValid(false)
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
