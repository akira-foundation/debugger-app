import { useEffect, useState } from 'react'
import { useLicenseValidation } from './useLicenseValidation'
import { LicenseStatus } from '../types/license'

export function useLicenseManagement() {
  const { licenseValidation, validate, setLicenseKey, activateTrial } = useLicenseValidation()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const validateLicense = async () => {
      await validate()
      // Hide splash after validation attempt
      setTimeout(() => setShowSplash(false), 500)
    }

    validateLicense()
  }, [validate])

  const handleLicenseKeySubmit = async (key: string) => {
    await setLicenseKey(key)
    await validate()
  }

  const handleTrialActivation = async () => {
    await activateTrial()
    await validate()
  }

  const isLicenseValid = licenseValidation.status === LicenseStatus.VALID
  const isTrialActive = licenseValidation.status === LicenseStatus.TRIAL_ACTIVE

  return {
    licenseValidation,
    showSplash,
    setShowSplash,
    isLicenseValid,
    isTrialActive,
    handleLicenseKeySubmit,
    handleTrialActivation,
  }
}
