import { Search } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function SearchBar({ searchQuery, onSearchChange, isOpen, onToggle }: SearchBarProps) {
  if (!isOpen) return null

  return (
    <div className="px-4 py-2.5 bg-transparent border-b border-white/5">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
        />
      </div>
    </div>
  )
}
