import { Search, Pin, Trash2 } from 'lucide-react'

interface HeaderProps {
  isListening: boolean
  onClear: () => void
  isPinned: boolean
  onTogglePin: () => void
  isSearchOpen: boolean
  onToggleSearch: () => void
}

export function Header({ isListening, onClear, isPinned, onTogglePin, isSearchOpen, onToggleSearch }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-[#0f0f0f] border-b border-white/5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {isListening ? 'Listening...' : 'Offline'}
        </h1>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isListening
            ? 'bg-green-400 animate-[ping_2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
            : 'bg-gray-600'
        }`}>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSearch}
          title="Search logs (Cmd+F)"
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isSearchOpen
              ? 'bg-purple-700 text-white'
              : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300'
          }`}
        >
          <Search size={16} />
        </button>
        <button
          onClick={onTogglePin}
          title={`${isPinned ? 'Unpin' : 'Pin'} window`}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isPinned
              ? 'bg-purple-700 text-white'
              : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300'
          }`}
        >
          <Pin size={16} fill={isPinned ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={onClear}
          title="Clear logs (Cmd+L)"
          className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 transition-all cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </header>
  )
}
