import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'

interface ExecutedQueryDisplayProps {
  content: string[]
}

export function ExecutedQueryDisplay({ content }: ExecutedQueryDisplayProps) {
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-2">
      {/* Connection Info */}
      <div className="rounded-lg overflow-hidden border border-white/10">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Connection: <span className="text-gray-200 font-mono">{connectionName}</span>
            </span>
            <span className="text-xs text-gray-400">
              Time: <span className="text-cyan-400 font-mono">{time.toFixed(2)}ms</span>
            </span>
          </div>
        </div>
      </div>

      {/* SQL Query */}
      <div className="rounded-lg overflow-hidden border border-white/10">
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
          <span className="text-xs font-medium text-gray-400">Query</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            title="Copy SQL to clipboard"
          >
            {copied ? (
              <>
                <Check size={12} className="text-green-400" />
                <span className="text-xs text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">
            <SyntaxHighlighter text={formattedSql} />
          </div>
        </div>
      </div>
    </div>
  )
}
