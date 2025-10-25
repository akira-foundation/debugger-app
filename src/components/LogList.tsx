import { LogEntry as LogEntryType, RayColor, ExpandedItems } from '../types'
import { LogEntry } from './LogEntry'

interface LogListProps {
  logs: LogEntryType[]
  selectedColor: RayColor | null
  expandedLogs: Set<string>
  expandedItems: ExpandedItems
  onToggleExpand: (logId: string) => void
  onToggleItem: (logId: string, itemIndex: string) => void
  shouldShowExpandButton: (content: string[]) => boolean
  getLogTypeColor: (type: string) => string
  searchQuery: string
}

export function LogList({
  logs,
  selectedColor,
  expandedLogs,
  expandedItems,
  onToggleExpand,
  onToggleItem,
  shouldShowExpandButton,
  getLogTypeColor,
  searchQuery,
}: LogListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-5 bg-[#0f0f0f] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#0f0f0f] [&::-webkit-scrollbar-thumb]:bg-purple-600/40 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-purple-600/60">
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-600 text-sm">
          <p>Waiting for logs...</p>
        </div>
      ) : (
        [...logs]
          .reverse()
          .filter((log) => {
            // Always hide 'color' type logs from display
            if (log.type === 'color') return false
            // Filter by color
            if (selectedColor && (log.color || 'default') !== selectedColor) return false
            // Filter by search query
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase()
              const contentMatch = log.content.some((line) =>
                line.toLowerCase().includes(query)
              )
              const locationMatch = log.location.toLowerCase().includes(query)
              const typeMatch = log.type.toLowerCase().includes(query)
              const labelMatch = log.pending_label?.toLowerCase().includes(query) || false
              return contentMatch || locationMatch || typeMatch || labelMatch
            }
            return true
          })
          .map((log) => {
            const hasMore = shouldShowExpandButton(log.content)
            const isExpanded = expandedLogs.has(log.id) || !hasMore

            return (
              <LogEntry
                key={log.id}
                log={log}
                isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpand(log.id)}
                expandedItems={expandedItems}
                onToggleItem={onToggleItem}
                shouldShowExpandButton={hasMore}
                getLogTypeColor={getLogTypeColor}
              />
            )
          })
      )}
    </div>
  )
}
