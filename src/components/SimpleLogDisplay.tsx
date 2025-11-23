import { SyntaxHighlighter } from '../utils/syntax'

interface SimpleLogDisplayProps {
  content: string[]
}

export function SimpleLogDisplay({ content }: SimpleLogDisplayProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/10">
      <div className="px-4 py-3">
        <div className="px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">
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
