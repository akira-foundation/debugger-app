import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'
import './App.css'

import { Header } from './components/Header'
import { ColorFilter } from './components/ColorFilter'
import { SearchBar } from './components/SearchBar'
import { LogList } from './components/LogList'
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

  useEffect(() => {
    const unlistenLog = listen('log-entry', (event: any) => {
      const logEntry: LogEntry = event.payload
      setLogs((prev) => [logEntry, ...prev].slice(0, 100))
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

    Promise.all([unlistenLog, unlistenLabel, unlistenColor]).then(() => {
      setIsListening(true)
    })

    return () => {
      Promise.all([unlistenLog, unlistenLabel, unlistenColor]).then(([fn1, fn2, fn3]) => {
        fn1()
        fn2()
        fn3()
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f0f] text-white font-sans">
      <Header isListening={isListening} onClear={clearLogs} isPinned={isPinned} onTogglePin={() => setIsPinned(!isPinned)} isSearchOpen={isSearchOpen} onToggleSearch={() => setIsSearchOpen(!isSearchOpen)} />
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} isOpen={isSearchOpen} onToggle={() => setIsSearchOpen(!isSearchOpen)} />
      <ColorFilter selectedColor={selectedColor} onSelectColor={setSelectedColor} />
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
    </div>
  )
}
