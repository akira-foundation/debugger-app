import { Copy, Check } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'
import { useLogStyle } from '../context/LogStyleContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

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
