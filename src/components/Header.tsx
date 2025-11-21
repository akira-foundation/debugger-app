import { Search, Pin, Trash2, Settings } from 'lucide-react'
import { rayColors } from '../types'
import type { RayColor } from '../types'

interface HeaderProps {
  isListening: boolean
  onClear: () => void
  isPinned: boolean
  onTogglePin: () => void
  isSearchOpen: boolean
  onToggleSearch: () => void
  selectedColor: RayColor | null
  onSelectColor: (color: RayColor | null) => void
  onToggleSettings: () => void
}

export function Header({ isListening, onClear, isPinned, onTogglePin, isSearchOpen, onToggleSearch, selectedColor, onSelectColor, onToggleSettings }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-2 bg-[#0f0f0f] border-b border-white/5 flex-shrink-0">
      <div className="flex items-center gap-2">
        {/* Status Indicator */}
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          isListening
            ? 'bg-green-400 animate-[ping_2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
            : 'bg-gray-600'
        }`}>
        </span>
        <span className="text-xs font-medium text-gray-300">
          {isListening ? 'Listening' : 'Offline'}
        </span>

        {/* Color Filter */}
        <div className="flex gap-1.5 items-center pl-2 border-l border-white/10">
          <button
            onClick={() => onSelectColor(null)}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-all flex-shrink-0 ${
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
                  className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${styles.bg} ${
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
    </header>
  )
}
