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
}: LogListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-5 bg-[#0f0f0f] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f0f0f] [&::-webkit-scrollbar-thumb]:bg-purple-600/40 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-purple-600/60">
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
            // If no color filter selected, show all non-color logs
            if (!selectedColor) return true
            // Filter by color
            return (log.color || 'default') === selectedColor
          })
          .map((log) => {
            const hasMore = shouldShowExpandButton(log.content)
            const isExpanded = hasMore ? expandedLogs.has(log.id) : true

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
