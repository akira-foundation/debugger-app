import { Copy, Check } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'
import { useLogStyle } from '../context/LogStyleContext'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

interface ExecutedQueryDisplayProps {
  content: string[]
}

export function ExecutedQueryDisplay({ content }: ExecutedQueryDisplayProps) {
  const { borderClass } = useLogStyle()
  const { copied, copy } = useCopyToClipboard()

  let connectionName = ''
  let sql = ''
  let time = 0

  // Parse JSON from first element
  if (content.length > 0) {
    try {
      const data = JSON.parse(content[0])
      connectionName = data.connection_name || ''
      sql = data.sql || ''
      time = data.time || 0
    } catch (e) {
      console.error('Failed to parse executed query:', e)
      return null
    }
  }

  // Format SQL with proper indentation and line breaks
  const formatSql = (sqlStr: string): string => {
    // Replace escape quotes
    let formatted = sqlStr.replace(/\\"/g, '"')

    // Add newlines after main SQL keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'UPDATE', 'SET', 'INSERT INTO', 'VALUES', 'DELETE FROM', 'ORDER BY', 'GROUP BY', 'LIMIT', 'OFFSET']

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\s+${keyword}\\s+`, 'gi')
      formatted = formatted.replace(regex, `\n${keyword} `)
    })

    // Add newlines after commas (for multi-column statements)
    formatted = formatted.replace(/,\s*/g, ',\n  ')

    // Add newlines before AND/OR in WHERE clauses
    formatted = formatted.replace(/\s+(AND|OR)\s+/gi, '\n  $1 ')

    return formatted.trim()
  }

  const formattedSql = formatSql(sql)

  const handleCopy = () => {
    copy(sql)
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
      {/* Header with Connection and Time Info */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="text-xs space-y-1">
          <div className="flex gap-4">
            <span className="text-gray-400">Connection: <span className="text-gray-200 font-mono">{connectionName}</span></span>
            <span className="text-gray-400">Time: <span className="text-cyan-400 font-mono">{time.toFixed(2)}ms</span></span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
          title="Copy SQL to clipboard"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* SQL Content */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="whitespace-pre-wrap break-words font-mono text-xs text-gray-200">
          <SyntaxHighlighter text={formattedSql} />
        </div>
      </div>
    </div>
  )
}
