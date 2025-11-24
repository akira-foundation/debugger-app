import React from 'react'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'
import { ExpandedItems } from '../types'
import { parseArrayItems } from '../utils/array'
import { SyntaxHighlighter } from '../utils/syntax'
import { useLogStyle } from '../context/LogStyleContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

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
  const { borderClass, textClass } = useLogStyle()
  const { copied, copy } = useCopyToClipboard()
  // Se content é uma única linha com \n, faz split
  const contentLines = content.length === 1 && content[0].includes('\n')
    ? content[0].split('\n')
    : content

  const items = parseArrayItems(contentLines)
  const logExpandedItems = expandedItems[logId] || new Set<string>()
  const contentText = contentLines.join('\n')

  return (
    <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
      {/* Array items inside single card */}
      {items.map((item, itemIdx) => {
        const isExpanded = logExpandedItems.has(item.index)
        const hasDetails = item.lines.length > 1
        const isLastItem = itemIdx === items.length - 1
        const itemText = item.lines.join('\n')
        const [itemCopied, setItemCopied] = React.useState(false)

        const handleItemCopy = () => {
          copy(itemText)
          setItemCopied(true)
          setTimeout(() => setItemCopied(false), 2000)
        }

        return (
          <div key={item.index}>
            {/* Item header with toggle button */}
            <div className="w-full flex items-center  px-4 py-2.5 hover:bg-white/5 transition-colors group overflow-x-auto">
              {hasDetails && (
                <button
                  onClick={() => onToggleItem(logId, item.index)}
                  className={`${textClass} group-hover:opacity-70 flex-shrink-0 transition-opacity cursor-pointer`}
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
              )}
              <button
                onClick={() => onToggleItem(logId, item.index)}
                className="flex-1 text-left cursor-pointer text-gray-300 whitespace-nowrap -ml-4"
              >
                <SyntaxHighlighter text={item.lines[0]} />
              </button>
              <button
                onClick={handleItemCopy}
                className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
                title="Copy item"
              >
                {itemCopied ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} className="text-gray-400" />
                )}
              </button>
            </div>

            {/* Expanded content */}
            {isExpanded && hasDetails && (
              <div className="px-4 py-3 space-y-0 border-t border-white/10 overflow-x-auto">
                {item.lines.slice(1).map((line, idx) => (
                  <div
                    key={idx}
                    className="text-[12px] text-dracula-foreground py-1 whitespace-nowrap"
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
