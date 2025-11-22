import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'
import './App.css'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SearchBar } from './components/SearchBar'
import { LogList } from './components/LogList'
import { LicenseSplash } from './components/LicenseSplash'
import { LicenseSettings } from './components/LicenseSettings'
import { useLicenseValidation } from './hooks/useLicenseValidation'
import { backendLicenseService } from './services/backendLicenseService'
import { APP_VERSION } from './version'
import type { LogEntry, RayColor, ExpandedItems } from './types'

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isListening, setIsListening] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({})
  const [selectedColor, setSelectedColor] = useState<RayColor | null>(null)
  const [isPinned, setIsPinned] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showLicenseSettings, setShowLicenseSettings] = useState(false)

  // License validation
  const licenseValidation = useLicenseValidation()
  const [licenseValidationComplete, setLicenseValidationComplete] = useState(false)
  const [isValidatingLicense, setIsValidatingLicense] = useState(false)
  const [isTrialActive, setIsTrialActive] = useState(false)
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0)

  // Initialize license validation on app mount
  useEffect(() => {
    licenseValidation.validate()
    const loadTrialInfo = async () => {
      try {
        const active = await backendLicenseService.isTrialActive()
        const daysRemaining = await backendLicenseService.getTrialDaysRemaining()
        setIsTrialActive(active)
        setTrialDaysRemaining(Number(daysRemaining))
      } catch (error) {
        console.error('Failed to load trial info:', error)
      }
    }
    loadTrialInfo()
  }, [])

  // Show splash screen during validation, or if validation fails allow to continue
  const handleValidationComplete = (validation: any) => {
    setLicenseValidationComplete(true)
  }

  // Handle license validation refresh
  const handleLicenseRefresh = async () => {
    setIsValidatingLicense(true)
    try {
      await licenseValidation.validate()
    } finally {
      setIsValidatingLicense(false)
    }
  }

  useEffect(() => {
    const unlistenLog = listen('log-entry', (event: any) => {
      const logEntry: LogEntry = event.payload
      setLogs((prev) => [logEntry, ...prev])
    })

    const unlistenLabel = listen('attach-label', (event: any) => {
      const { label } = event.payload
      // Attach label to the first (most recent) log
      setLogs((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        updated[0] = {
          ...updated[0],
          pending_label: label,
        }
        return updated
      })
    })

    const unlistenColor = listen('attach-color', (event: any) => {
      const { color } = event.payload
      // Attach color to the first (most recent) log
      setLogs((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        updated[0] = {
          ...updated[0],
          color: color as RayColor,
        }
        return updated
      })
    })

    const unlistenAbout = listen('show_about', () => {
      setShowAbout(true)
    })

    Promise.all([unlistenLog, unlistenLabel, unlistenColor, unlistenAbout]).then(() => {
      setIsListening(true)
    })

    return () => {
      Promise.all([unlistenLog, unlistenLabel, unlistenColor, unlistenAbout]).then(([fn1, fn2, fn3, fn4]) => {
        fn1()
        fn2()
        fn3()
        fn4()
      })
    }
  }, [])

  const clearLogs = () => setLogs([])

  // Handle window pin/unpin
  useEffect(() => {
    const togglePin = async () => {
      try {
        await invoke('set_always_on_top', { alwaysOnTop: isPinned })
      } catch (e) {
        console.warn('Could not toggle pin:', e)
      }
    }
    togglePin()
  }, [isPinned])

  // Handle keyboard shortcut for clearing logs (Cmd+L or Ctrl+L) and search (Cmd+F or Ctrl+F)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault()
        clearLogs()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search logs"]') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 0)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const toggleItemExpanded = (logId: string, itemIndex: string) => {
    const newItems = { ...expandedItems }
    if (!newItems[logId]) {
      newItems[logId] = new Set<string>()
    }

    const logItems = new Set(newItems[logId])
    if (logItems.has(itemIndex)) {
      logItems.delete(itemIndex)
    } else {
      logItems.add(itemIndex)
    }
    newItems[logId] = logItems
    setExpandedItems(newItems)
  }

  const shouldShowExpandButton = (content: string[]) => {
    return content.length > 1 || (content.length > 0 && content[0].length > 200)
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-400'
      case 'warning': return 'text-dracula-orange'
      case 'error': return 'text-dracula-red'
      default: return 'text-dracula-foreground'
    }
  }

  // Show license settings page if user requested it
  if (showLicenseSettings) {
    return (
      <LicenseSettings
        onBack={() => setShowLicenseSettings(false)}
        validation={licenseValidation.validation}
        onValidationRefresh={handleLicenseRefresh}
        isValidating={isValidatingLicense}
      />
    )
  }

  // Show license splash during validation
  if (!licenseValidationComplete) {
    return <LicenseSplash onValidationComplete={handleValidationComplete} onOpenSettings={() => setShowLicenseSettings(true)} />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] text-white font-sans">
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] rounded-lg p-8 max-w-md w-96 border border-white/10">
            <h2 className="text-2xl font-bold mb-2 text-white">Akira Debugger</h2>
            <p className="text-xs text-gray-500 mb-6">v{APP_VERSION}</p>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              A lightweight debugging tool for PHP applications.
            </p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Monitor and analyze application logs in real-time.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Header
        isListening={isListening}
        onClear={clearLogs}
        isPinned={isPinned}
        onTogglePin={() => setIsPinned(!isPinned)}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        onToggleSettings={() => setShowLicenseSettings(true)}
        isTrialActive={isTrialActive}
        trialDaysRemaining={trialDaysRemaining}
      />
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} isOpen={isSearchOpen} onToggle={() => setIsSearchOpen(!isSearchOpen)} />
      <LogList
        logs={logs}
        selectedColor={selectedColor}
        expandedLogs={expandedLogs}
        expandedItems={expandedItems}
        onToggleExpand={toggleExpanded}
        onToggleItem={toggleItemExpanded}
        shouldShowExpandButton={shouldShowExpandButton}
        getLogTypeColor={getLogTypeColor}
        searchQuery={searchQuery}
      />
      <Footer logs={logs} />
    </div>
  )
}
