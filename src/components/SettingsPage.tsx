import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { CachedLicenseValidation } from '../types/license'
import { backendLicenseService } from '../services/backendLicenseService'
import { getInstalledEditors, getPreferredEditor, savePreferredEditor, EditorInfo } from '../services/editorService'
import { TrialSection } from './settings/TrialSection'
import { LicenseStatusSection } from './settings/LicenseStatusSection'
import { LicenseKeySection } from './settings/LicenseKeySection'
import { EditorSection } from './settings/EditorSection'
import { LogBorderSection } from './settings/LogBorderSection'
import { LogDisplaySection } from './settings/LogDisplaySection'

interface SettingsPageProps {
  onBack: () => void
  validation: CachedLicenseValidation | null
  onValidationRefresh: () => void
  isValidating: boolean
}

export function SettingsPage({ onBack, validation, onValidationRefresh }: SettingsPageProps) {
  const [licenseKey, setLicenseKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editorMessage, setEditorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isTrialActive, setIsTrialActive] = useState(false)
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0)
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null)
  const [installedEditors, setInstalledEditors] = useState<EditorInfo[]>([])
  const [preferredEditorId, setPreferredEditorId] = useState<string>('phpstorm')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    license: true,
    preferences: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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
      setEditorMessage({ type: 'success', text: `Editor changed to ${installedEditors.find(e => e.id === editorId)?.name || editorId}` })
      setTimeout(() => setEditorMessage(null), 3000)
    } catch (err) {
      setEditorMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to change editor',
      })
    }
  }

  const handleLicenseKeyChange = async (key: string) => {
    setLicenseKey(key)

    if (key.trim()) {
      setIsSaving(true)
      try {
        await backendLicenseService.setLicenseKey(key)
        setTimeout(() => {
          onValidationRefresh()
        }, 300)
      } catch (error) {
        console.error('Failed to save license key:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] text-white font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 border-b border-white/5">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      {/* Content - Single Column Layout */}
      <div className="flex-1 overflow-auto  h-screen  ">
        <div className="max-w-2xl space-y-6 p-2 mx-auto ">
          {/* License Section */}
          <div className="space-y-4 mt-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">License</div>
            <div className="space-y-4">
              <TrialSection
                isTrialActive={isTrialActive}
                trialDaysRemaining={trialDaysRemaining}
                trialStartDate={trialStartDate}
              />

              <LicenseStatusSection validation={validation} />

              <LicenseKeySection
                licenseKey={licenseKey}
                isSaving={isSaving}
                onLicenseKeyChange={handleLicenseKeyChange}
                onValidationRefresh={onValidationRefresh}
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Preferences</div>
            <div className="space-y-4">
              <EditorSection
                installedEditors={installedEditors}
                preferredEditorId={preferredEditorId}
                message={editorMessage}
                onEditorChange={handleEditorChange}
              />

              <LogBorderSection />

              <LogDisplaySection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
