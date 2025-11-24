import { ChevronRight, ChevronDown } from 'lucide-react'
import { ExpandedItems } from '../types'
import { parseArrayItems } from '../utils/array'
import { SyntaxHighlighter } from '../utils/syntax'

interface CollapsibleArrayProps {
  logId: string
  content: string[]
  expandedItems: ExpandedItems
  onToggleItem: (logId: string, itemIndex: string) => void
}

export function CollapsibleArray({
  logId,
  content,
  expandedItems,
  onToggleItem,
}: CollapsibleArrayProps) {
  // Se content é uma única linha com \n, faz split
  const contentLines = content.length === 1 && content[0].includes('\n')
    ? content[0].split('\n')
    : content

  const items = parseArrayItems(contentLines)
  const logExpandedItems = expandedItems[logId] || new Set<string>()

  return (
    <div className="rounded-lg overflow-hidden border border-white/10">
      {/* Array items inside single card */}
      {items.map((item, itemIdx) => {
        const isExpanded = logExpandedItems.has(item.index)
        const hasDetails = item.lines.length > 1
        const isLastItem = itemIdx === items.length - 1

        return (
          <div key={item.index}>
            {/* Item header with toggle button */}
            <button
              onClick={() => onToggleItem(logId, item.index)}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors group"
            >
              {hasDetails && (
                <span className="text-purple-400 group-hover:text-purple-300 flex-shrink-0">
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </span>
              )}
              <span className="flex-1 overflow-x-auto text-gray-300">
                <SyntaxHighlighter text={item.lines[0]} />
              </span>
            </button>

            {/* Expanded content */}
            {isExpanded && hasDetails && (
              <div className="px-4 py-3 space-y-0 border-t border-white/10">
                {item.lines.slice(1).map((line, idx) => (
                  <div
                    key={idx}
                    className="text-[12px] overflow-x-auto text-dracula-foreground py-1"
                  >
                    <SyntaxHighlighter text={line} />
                  </div>
                ))}
              </div>
            )}

            {/* Divider between items */}
            {!isLastItem && <div className="border-t border-white/10"></div>}
          </div>
        )
      })}
    </div>
  )
}
