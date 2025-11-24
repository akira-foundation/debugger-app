import { useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { LogEntry } from '../types'

interface LogEventListenersProps {
  onLogEntry: (log: LogEntry) => void
  onAttachLabel: (data: { logId: string; label: string }) => void
  onAttachColor: (data: { logId: string; color: string }) => void
  onShowAbout: () => void
}

export function useLogEventListeners({
  onLogEntry,
  onAttachLabel,
  onAttachColor,
  onShowAbout,
}: LogEventListenersProps) {
  useEffect(() => {
    const setupListeners = async () => {
      await listen<LogEntry>('log-entry', (event) => {
        onLogEntry(event.payload)
      })

      await listen<{ logId: string; label: string }>('attach-label', (event) => {
        onAttachLabel(event.payload)
      })

      await listen<{ logId: string; color: string }>('attach-color', (event) => {
        onAttachColor(event.payload)
      })

      await listen('show_about', () => {
        onShowAbout()
      })
    }

    setupListeners().catch(console.error)
  }, [onLogEntry, onAttachLabel, onAttachColor, onShowAbout])
}
