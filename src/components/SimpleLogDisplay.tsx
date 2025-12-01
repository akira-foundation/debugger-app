import { useState, useEffect, useRef } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'
import { useLogStyle } from '../context/LogStyleContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { useLogDisplayStore } from '../stores/logDisplayStore'

interface SimpleLogDisplayProps {
  content: string[]
}

export function SimpleLogDisplay({ content }: SimpleLogDisplayProps) {
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const maxHeight = useLogDisplayStore((state) => state.config.maxHeight)
  const { borderClass } = useLogStyle()
  const { copied, copy } = useCopyToClipboard()
  const contentText = content.join('\n')

  const isFullyExpanded = expandedHeight !== null && expandedHeight >= contentHeight
  const currentMaxHeight = expandedHeight === null ? maxHeight : expandedHeight

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [content])

  const handleCopy = () => {
    copy(contentText)
  }

  // Show debug info if content is empty or doesn't have valid data
  if (!content || content.length === 0 || (content.length === 1 && !content[0])) {
    return (
      <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
        <div className="px-4 py-3 text-xs text-gray-500">
          No data available
        </div>
      </div>
    )
  }

  const handleToggleExpand = () => {
    if (isFullyExpanded) {
      setExpandedHeight(null)
    } else {
      const newHeight = (expandedHeight || maxHeight) + maxHeight
      setExpandedHeight(newHeight)
    }
  }

  return (
    <div className={`rounded-lg border ${borderClass}`}>
      <div className={`px-4 py-3 overflow-x-auto flex items-start justify-between gap-4 overflow-y-hidden`} style={{ maxHeight: `${currentMaxHeight}px` }}>
        <div ref={contentRef} className="whitespace-pre-wrap break-words font-mono text-xs text-gray-200 flex-1">
          {content.map((line, idx) => (
            <div key={idx}>
              <SyntaxHighlighter text={line} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/5 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {contentHeight > maxHeight && (
        <button
          onClick={handleToggleExpand}
          className="w-full px-3 py-2 text-xs text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-1 border-t border-white/5 cursor-pointer"
        >
          {isFullyExpanded ? (
            <>
              <ChevronUp size={14} />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              Expand {expandedHeight !== null && `(${Math.round((currentMaxHeight / contentHeight) * 100)}%)`}
            </>
          )}
        </button>
      )}
    </div>
  )
}
