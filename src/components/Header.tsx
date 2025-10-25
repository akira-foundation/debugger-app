interface HeaderProps {
  isListening: boolean
  onClear: () => void
  isPinned: boolean
  onTogglePin: () => void
}

export function Header({ isListening, onClear, isPinned, onTogglePin }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-[#0f0f0f] border-b border-white/5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Akira Debugger
        </h1>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isListening
            ? 'bg-green-400 animate-[ping_2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
            : 'bg-gray-600'
        }`}>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePin}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            isPinned
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-white/10 hover:bg-white/15 text-white'
          }`}
        >
          {isPinned ? 'Pinned' : 'Pin'}
        </button>
        <button
          onClick={onClear}
          title="Clear logs (Cmd+L or Ctrl+L)"
          className="px-4 py-2 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/15 transition-all"
        >
          Clear
        </button>
      </div>
    </header>
  )
}
