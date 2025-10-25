import { LogEntry as LogEntryType, ExpandedItems } from '../types'
import { isArrayContent } from '../utils/array'
import { SyntaxHighlighter } from '../utils/syntax'
import { CollapsibleArray } from './CollapsibleArray'

interface LogEntryProps {
  log: LogEntryType
  isExpanded: boolean
  onToggleExpand: () => void
  expandedItems: ExpandedItems
  onToggleItem: (logId: string, itemIndex: string) => void
  shouldShowExpandButton: boolean
  getLogTypeColor: (type: string) => string
}

export function LogEntry({
  log,
  isExpanded,
  onToggleExpand,
  expandedItems,
  onToggleItem,
  shouldShowExpandButton,
  getLogTypeColor,
}: LogEntryProps) {
  return (
    <div
      key={log.id}
      className="glass card mb-4 font-mono text-[13px] leading-relaxed overflow-hidden group hover:shadow-lg hover:shadow-purple-500/30 backdrop-blur-lg"
    >
      {/* Clickable header to toggle expand */}
      <button
        onClick={onToggleExpand}
        className="w-full text-left p-4 hover:bg-black/20 transition-colors flex gap-3 items-center group flex-wrap"
      >
        {shouldShowExpandButton && (
          <span className="text-purple-400 group-hover:text-purple-300 flex-shrink-0 font-bold text-sm">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <div className="flex gap-3 items-center flex-1 text-xs text-gray-400 flex-wrap w-full">
          <span className={`px-3 py-1 rounded-full font-semibold text-[11px] ${getLogTypeColor(log.type)} bg-white/5 group-hover:bg-white/10 transition-colors`}>
            {log.type.toUpperCase()}
          </span>
          {log.pending_label && (
            <span className="px-3 py-1 rounded-full font-semibold text-[11px] border border-purple-500/50 text-purple-400 bg-purple-500/10">
              {log.pending_label}
            </span>
          )}
          <span className="text-gray-600 text-[11px]">{log.location}</span>
          <span className="ml-auto text-gray-600 text-[11px] font-mono">{log.timestamp}</span>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {isArrayContent(log.content as string[]) ? (
            <CollapsibleArray
              logId={log.id}
              content={log.content}
              expandedItems={expandedItems}
              onToggleItem={onToggleItem}
            />
          ) : (
            <div className="space-y-2">
              {log.content.map((line, idx) => (
                <div
                  key={idx}
                  className="bg-black/30 px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words"
                >
                  <SyntaxHighlighter text={line} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
