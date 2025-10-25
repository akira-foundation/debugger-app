interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function SearchBar({ searchQuery, onSearchChange, isOpen, onToggle }: SearchBarProps) {
  if (!isOpen) return null

  return (
    <div className="px-6 py-1.5 bg-[#0f0f0f] border-b border-white/5">
      <input
        type="text"
        placeholder="Search logs... (Cmd+F or Ctrl+F)"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        autoFocus
        className="w-full px-3 py-1 text-xs rounded bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
      />
    </div>
  )
}
