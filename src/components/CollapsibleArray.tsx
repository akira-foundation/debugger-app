import React, { useMemo } from 'react'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'
import { ExpandedItems } from '../types'
import { parseArrayItems } from '../utils/array'
import { SyntaxHighlighter } from '../utils/syntax'
import { useLogStyle } from '../context/LogStyleContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { useLogDisplayStore } from '../stores/logDisplayStore'

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
  const [copiedItemIndex, setCopiedItemIndex] = React.useState<string | null>(null)

  // Se content é uma única linha com \n, faz split
  const contentLines = useMemo(() => {
    const lines = content.length === 1 && content[0].includes('\n')
      ? content[0].split('\n')
      : content
    console.log(`CollapsibleArray: content.length=${content.length}, contentLines.length=${lines.length}`)
    return lines
  }, [content])

  const items = useMemo(() => {
    const parsed = parseArrayItems(contentLines)
    console.log(`CollapsibleArray.items: Parsed ${parsed.length} items from ${contentLines.length} contentLines`)
    return parsed
  }, [contentLines])
  const ITEMS_PER_PAGE = useLogDisplayStore((state) => state.config.itemsPerLog)
  const [displayedCount, setDisplayedCount] = React.useState(() => Math.min(ITEMS_PER_PAGE, items.length))
  const logExpandedItems = expandedItems[logId] || new Set<string>()
  const contentText = useMemo(() => contentLines.join('\n'), [contentLines])
  const visibleItems = useMemo(() => items.slice(0, displayedCount), [items, displayedCount])
  const hasMoreItems = displayedCount < items.length

  React.useEffect(() => {
    console.log(`CollapsibleArray.displayedCount updated: ${displayedCount}, items.length: ${items.length}, hasMoreItems: ${hasMoreItems}`)
  }, [displayedCount, items.length, hasMoreItems])


  return (
    <div className={`rounded-lg border ${borderClass}`}>
      {/* Array items inside single card */}
      <div className="overflow-hidden">
        {items.slice(0, displayedCount).map((item, itemIdx) => {
        const isExpanded = logExpandedItems.has(item.index)
        const hasDetails = item.lines.length > 1
        const isLastVisibleItem = itemIdx === displayedCount - 1
        const itemText = item.lines.join('\n')
        const isItemCopied = copiedItemIndex === item.index

        const handleItemCopy = () => {
          copy(itemText)
          setCopiedItemIndex(item.index)
          setTimeout(() => setCopiedItemIndex(null), 2000)
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
                {isItemCopied ? (
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
            {!isLastVisibleItem && <div className="border-t border-white/10"></div>}
          </div>
        )
        })}
      </div>

      {/* Show more button */}
      {hasMoreItems && (
        <button
          onClick={() => {
            try {
              setDisplayedCount(prev => {
                const newCount = prev + ITEMS_PER_PAGE
                return newCount > items.length ? items.length : newCount
              })
            } catch (e) {
              console.error('Error loading more items:', e)
            }
          }}
          className="w-full px-4 py-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-colors border-t border-white/10 text-left"
        >
          <div className="font-medium text-sm">Showing {displayedCount} of {items.length} items</div>
          <div className="text-xs text-gray-500 mt-0.5">+ Load {Math.min(ITEMS_PER_PAGE, items.length - displayedCount)} more</div>
        </button>
      )}
    </div>
  )
}
