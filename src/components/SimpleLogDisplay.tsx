import { Copy, Check } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'
import { useLogStyle } from '../context/LogStyleContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { TableDisplay } from './TableDisplay'

interface SimpleLogDisplayProps {
  content: string[]
}

export function SimpleLogDisplay({ content }: SimpleLogDisplayProps) {
  const { borderClass } = useLogStyle()
  const { copied, copy } = useCopyToClipboard()
  const contentText = content.join('\n')

  const handleCopy = () => {
    copy(contentText)
  }

  // Try to detect if content is table data (JSON object with key-value pairs)
  let tableData: Record<string, any> | null = null
  if (content.length > 0) {
    try {
      const parsed = JSON.parse(content[0])
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        tableData = parsed
      }
    } catch (e) {
      // Not JSON, continue with regular display
    }
  }

  if (tableData) {
    return <TableDisplay data={tableData} />
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

  return (
    <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
      <div className="px-4 py-3 overflow-x-auto flex items-start justify-between gap-4">
        <div className="whitespace-pre-wrap break-words font-mono text-xs text-gray-200 flex-1">
          {content.map((line, idx) => (
            <div key={idx}>
              <SyntaxHighlighter text={line} />
            </div>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
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
  )
}
