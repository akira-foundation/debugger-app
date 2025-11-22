import { Download } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function SearchBar({ searchQuery, onSearchChange, isOpen, onToggle }: SearchBarProps) {
  const handleExport = () => {
    const logsText = localStorage.getItem('logs') || '[]'
    const logs = JSON.parse(logsText)

    const csv = logs.map((log: any) => {
      const content = Array.isArray(log.content) ? log.content.join(' ') : log.content
      return `"${log.type}","${log.timestamp}","${content}","${log.location}"`
    }).join('\n')

    const header = '"TYPE","TIMESTAMP","CONTENT","LOCATION"\n'
    const blob = new Blob([header + csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `akira-debugger-logs-${new Date().toISOString()}.csv`
    a.click()
  }

  if (!isOpen) return null

  return (
    <div className="px-4 py-2.5 bg-transparent border-b border-white/5">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
          />
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2 text-xs font-medium whitespace-nowrap"
        >
          <Download size={12} />
          Export
        </button>
      </div>
    </div>
  )
}
