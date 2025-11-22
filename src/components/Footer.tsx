import { useEffect, useState } from 'react'
import { Download, ChevronUp } from 'lucide-react'
import { invoke } from '@tauri-apps/api/core'

interface FooterProps {
  logs: any[]
}

const APP_VERSION = '0.1.0'

export function Footer({ logs }: FooterProps) {
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    const updateMemory = async () => {
      try {
        const usage = await invoke<number>('get_memory_usage')
        setMemoryUsage(usage)
      } catch (err) {
        console.error('Failed to get memory usage:', err)
      }
    }

    updateMemory()
    const interval = setInterval(updateMemory, 2000)
    return () => clearInterval(interval)
  }, [])

  const formatMemory = (kb: number) => {
    if (kb > 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(1)}GB`
    } else if (kb > 1024) {
      return `${(kb / 1024).toFixed(1)}MB`
    }
    return `${kb}KB`
  }

  const handleExport = async (format: 'json' | 'csv') => {
    console.log('Export clicked:', format, 'logs count:', logs.length)

    if (logs.length === 0) {
      alert('No logs to export')
      setShowExportMenu(false)
      return
    }

    let content = ''

    if (format === 'json') {
      content = JSON.stringify(logs, null, 2)
    } else {
      const headers = ['Type', 'Time', 'Location', 'Content']
      const rows = logs.map(log => [
        log.type,
        log.timestamp,
        log.location,
        log.content.join(' ')
      ])
      content = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
    }

    try {
      console.log('Opening save dialog for format:', format)
      const filepath = await invoke<string | null>('open_save_logs_dialog', { format })

      if (filepath) {
        console.log('File path selected:', filepath)
        await invoke('write_logs_to_file', { filepath, content })
        console.log('Export successful!')
        alert(`Logs exported to:\n${filepath}`)
      } else {
        console.log('Export cancelled by user')
      }
    } catch (err) {
      console.error('Export failed:', err)
      alert(`Export failed: ${err}`)
    }

    setShowExportMenu(false)
  }

  return (
    <footer className="flex justify-between items-center px-6 py-2 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] border-t border-white/5 flex-shrink-0">
      <div className="text-xs text-gray-500">
        v{APP_VERSION} · {logs.length} logs · Memory: {formatMemory(memoryUsage)}
      </div>
      <div className="relative">
        <button
          onClick={() => logs.length > 0 && setShowExportMenu(!showExportMenu)}
          disabled={logs.length === 0}
          title={logs.length === 0 ? 'No logs to export' : 'Export logs'}
          className={`p-1 rounded flex items-center gap-1 transition-all ${
            logs.length === 0
              ? 'bg-gray-700/30 text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 cursor-pointer'
          }`}
        >
          <Download size={13} />
          <span className="text-xs">Export</span>
          <ChevronUp size={12} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
        </button>
        {showExportMenu && logs.length > 0 && (
          <div className="absolute bottom-full right-0 mb-1 bg-[#1a1a2e] border border-white/10 rounded shadow-lg z-50">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleExport('json')
              }}
              className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              JSON
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleExport('csv')
              }}
              className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer border-t border-white/5"
            >
              CSV
            </button>
          </div>
        )}
      </div>
    </footer>
  )
}
