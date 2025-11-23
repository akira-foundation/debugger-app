import { Search, Pin, Trash2, Settings, Monitor, Maximize2, Minimize2 } from 'lucide-react'
import { rayColors, logTypes } from '../types'
import type { RayColor, LogType } from '../types'

interface HeaderProps {
  isListening: boolean
  onClear: () => void
  isPinned: boolean
  onTogglePin: () => void
  isSearchOpen: boolean
  onToggleSearch: () => void
  selectedColor: RayColor | null
  onSelectColor: (color: RayColor | null) => void
  selectedLogTypes: Set<LogType>
  onToggleLogType: (logType: LogType) => void
  onToggleSettings: () => void
  onToggleAllLogs: () => void
  areAllLogsExpanded: boolean
  isTrialActive: boolean
  trialDaysRemaining: number
}

export function Header({ isListening, onClear, isPinned, onTogglePin, isSearchOpen, onToggleSearch, selectedColor, onSelectColor, selectedLogTypes, onToggleLogType, onToggleSettings, onToggleAllLogs, areAllLogsExpanded, isTrialActive, trialDaysRemaining }: HeaderProps) {
  return (
    <header className="flex flex-col bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] border-b border-white/5 flex-shrink-0">
      {/* First row: Status, Colors, and Action buttons */}
      <div className="flex justify-between items-center px-6 py-2">
        <div className="flex items-center gap-4">
          {/* Status Indicator with Monitor Icon */}
          <div className="flex items-center gap-2">
            <Monitor
              size={14}
              className={`flex-shrink-0 ${
                isListening ? 'text-green-400' : 'text-gray-600'
              }`}
              title={isListening ? 'Listening' : 'Offline'}
            />
            {isTrialActive && (
              <span className="text-xs font-medium text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded">
                Trial {trialDaysRemaining}d
              </span>
            )}
          </div>

          {/* Color Filter */}
          <div className="flex gap-1.5 items-center pl-2 border-l border-white/10">
            <button
              onClick={() => onSelectColor(null)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-all flex-shrink-0 cursor-pointer ${
                selectedColor === null
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All
            </button>
            <div className="flex gap-1 items-center">
              {Object.entries(rayColors)
                .filter(([color]) => color !== 'default')
                .map(([color, styles]) => (
                  <button
                    key={color}
                    onClick={() => onSelectColor(color as RayColor)}
                    className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 cursor-pointer ${styles.bg} ${
                      selectedColor === color ? 'ring-1 ring-white ring-offset-0.5' : 'opacity-40 hover:opacity-70'
                    }`}
                    title={color}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onToggleSearch}
            title="Search logs (Cmd+F)"
            className={`p-1 rounded transition-all cursor-pointer ${
              isSearchOpen
                ? 'bg-purple-700 text-white'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200'
            }`}
          >
            <Search size={13} />
          </button>
          <button
            onClick={onTogglePin}
            title={`${isPinned ? 'Unpin' : 'Pin'} window`}
            className={`p-1 rounded transition-all cursor-pointer ${
              isPinned
                ? 'bg-purple-700 text-white'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200'
            }`}
          >
            <Pin size={13} fill={isPinned ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onToggleSettings}
            title="Settings"
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
          >
            <Settings size={13} />
          </button>
          <button
            onClick={onClear}
            title="Clear logs (Cmd+L)"
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Second row: Log Type Filter */}
      <div className="flex gap-1 items-center px-6 py-1.5 border-t border-white/5 overflow-x-auto justify-between">
        <div className="flex gap-1 items-center overflow-x-auto">
          <span className="text-[10px] text-gray-500 font-medium flex-shrink-0">Type:</span>
        {(['log', 'eloquent_model', 'executed_query', 'mailable', 'application_log'] as const).map((type) => {
          const config = logTypes[type]
          return (
            <button
              key={type}
              onClick={() => onToggleLogType(type as LogType)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex-shrink-0 cursor-pointer whitespace-nowrap ${
                selectedLogTypes.has(type as LogType)
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              title={`Filter by ${config.label}`}
            >
              {config.label}
            </button>
          )
        })}
        </div>
        <button
          onClick={onToggleAllLogs}
          title={areAllLogsExpanded ? 'Collapse all logs' : 'Expand all logs'}
          className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-all cursor-pointer flex-shrink-0"
        >
          {areAllLogsExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      </div>
    </header>
  )
}
