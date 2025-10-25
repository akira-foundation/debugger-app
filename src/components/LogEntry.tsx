import { invoke } from '@tauri-apps/api/core'
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

function getLabelColorStyles(logColor: string | undefined) {
  const colorMap: Record<string, { border: string; text: string; bg: string }> = {
    default: { border: 'border-gray-600/50', text: 'text-gray-300', bg: 'bg-gray-600/10' },
    purple: { border: 'border-purple-500/50', text: 'text-purple-300', bg: 'bg-purple-500/10' },
    red: { border: 'border-red-500/50', text: 'text-red-300', bg: 'bg-red-500/10' },
    orange: { border: 'border-orange-500/50', text: 'text-orange-300', bg: 'bg-orange-500/10' },
    yellow: { border: 'border-yellow-500/50', text: 'text-yellow-300', bg: 'bg-yellow-500/10' },
    green: { border: 'border-green-500/50', text: 'text-green-300', bg: 'bg-green-500/10' },
    blue: { border: 'border-blue-500/50', text: 'text-blue-300', bg: 'bg-blue-500/10' },
    cyan: { border: 'border-cyan-500/50', text: 'text-cyan-300', bg: 'bg-cyan-500/10' },
    pink: { border: 'border-pink-500/50', text: 'text-pink-300', bg: 'bg-pink-500/10' },
  }

  const color = logColor || 'default'
  return colorMap[color] || colorMap['default']
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
  const handleOpenInEditor = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Parse location format: "filename.php:123"
      const [filename, line] = log.location.split(':')
      const lineNum = parseInt(line, 10) || 0
      await invoke('open_in_editor', { filePath: filename, line: lineNum })
    } catch (err) {
      console.error('Failed to open file in editor:', err)
    }
  }

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
          {log.pending_label && (() => {
            const labelColors = getLabelColorStyles(log.color)
            return (
              <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] border ${labelColors.border} ${labelColors.text} ${labelColors.bg}`}>
                {log.pending_label}
              </span>
            )
          })()}
          <span
            onClick={handleOpenInEditor}
            className="text-gray-600 text-[11px] cursor-pointer hover:text-purple-400 hover:underline transition-colors"
            title="Click to open in PhpStorm"
          >
            {log.location}
          </span>
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
