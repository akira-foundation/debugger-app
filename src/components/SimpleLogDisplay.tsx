import { SyntaxHighlighter } from '../utils/syntax'

interface SimpleLogDisplayProps {
  content: string[]
  borderClass?: string
}

export function SimpleLogDisplay({ content, borderClass = 'border-white/10' }: SimpleLogDisplayProps) {
  return (
    <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
      <div className="px-4 py-3 overflow-x-auto">
        <div className="whitespace-pre-wrap break-words font-mono text-xs text-gray-200">
          {content.map((line, idx) => (
            <div key={idx}>
              <SyntaxHighlighter text={line} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
