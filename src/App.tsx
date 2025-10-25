import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import './App.css'

interface LogEntry {
  id: string
  timestamp: string
  type: string
  location: string
  content: string[]
}

interface ExpandedItems {
  [key: string]: Set<string>
}

// Syntax highlighter component with JSON support
function HighlightedLine({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let i = 0

  while (i < text.length) {
    // Handle strings (with quotes)
    if (text[i] === '"') {
      let j = i + 1
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\') j++
        j++
      }
      parts.push(
        <span key={i} className="syntax-string">
          {text.substring(i, j + 1)}
        </span>
      )
      i = j + 1
    }
    // Handle numbers
    else if (/\d/.test(text[i])) {
      let j = i
      while (j < text.length && /[\d.eE+-]/.test(text[j])) j++
      parts.push(
        <span key={i} className="syntax-number">
          {text.substring(i, j)}
        </span>
      )
      i = j
    }
    // Handle booleans and null
    else if (text.substring(i, i + 4) === 'true') {
      parts.push(
        <span key={i} className="syntax-boolean">
          true
        </span>
      )
      i += 4
    } else if (text.substring(i, i + 5) === 'false') {
      parts.push(
        <span key={i} className="syntax-boolean">
          false
        </span>
      )
      i += 5
    } else if (text.substring(i, i + 4) === 'null') {
      parts.push(
        <span key={i} className="syntax-null">
          null
        </span>
      )
      i += 4
    }
    // Handle brackets and braces with color
    else if (text[i] === '{' || text[i] === '}' || text[i] === '[' || text[i] === ']') {
      parts.push(
        <span key={i} className="text-blue-400">
          {text[i]}
        </span>
      )
      i++
    }
    // Handle colons
    else if (text[i] === ':') {
      parts.push(
        <span key={i} className="text-gray-400">
          {text[i]}
        </span>
      )
      i++
    }
    // Handle commas
    else if (text[i] === ',') {
      parts.push(
        <span key={i} className="text-gray-400">
          {text[i]}
        </span>
      )
      i++
    }
    // Default
    else {
      parts.push(text[i])
      i++
    }
  }

  return <>{parts}</>
}

function SyntaxHighlighter({ text }: { text: string }) {
  const isJson = text.trim().startsWith('{') || text.trim().startsWith('[')

  if (isJson) {
    try {
      JSON.parse(text)
      // Valid JSON - format and highlight line by line
      const formatted = JSON.stringify(JSON.parse(text), null, 2)
      return (
        <pre className="syntax-highlight json">
          {formatted.split('\n').map((line, idx) => (
            <div key={idx}>
              <HighlightedLine text={line} />
            </div>
          ))}
        </pre>
      )
    } catch {
      // Not valid JSON, treat as plain text
    }
  }

  // Check if it looks like a single value
  const trimmed = text.trim()
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return <span className="syntax-number">{text}</span>
  }
  if (/^(true|false)$/i.test(trimmed)) {
    return <span className="syntax-boolean">{text}</span>
  }
  if (/^null$/i.test(trimmed)) {
    return <span className="syntax-null">{text}</span>
  }

  // Default: PHP dump format with basic highlighting
  return (
    <pre className="syntax-highlight php-dump">
      {text.split('\n').map((line, idx) => (
        <div key={idx}>
          <HighlightedLine text={line} />
        </div>
      ))}
    </pre>
  )
}

// Detect if content is an array/collection
function isArrayContent(content: string[]): boolean {
  if (content.length < 1) return false
  // Check if first line looks like array header
  const firstLine = content[0]
  return (
    firstLine.includes('array:') ||
    firstLine.includes('Collection') ||
    firstLine.includes('Illuminate\\Database')
  )
}

// Parse array items from content
function parseArrayItems(content: string[]): Array<{ index: string; lines: string[] }> {
  const items: Array<{ index: string; lines: string[] }> = []

  for (let i = 1; i < content.length; i++) {
    const line = content[i]
    // Match: "  0 => array:3 [" or "  0 => App\Model"
    const itemMatch = line.match(/^(\s+)(\d+)\s+=>/)

    if (itemMatch) {
      const itemLines = [line]
      const itemIndent = itemMatch[1].length

      // Collect all following lines until we find the next item at same indent level
      i++
      while (i < content.length) {
        const nextLine = content[i]

        // Check if this line is a new item (same pattern at same indentation)
        const nextItemMatch = nextLine.match(/^(\s+)(\d+)\s+=>/)
        if (nextItemMatch && nextItemMatch[1].length === itemIndent) {
          i-- // Back up so outer loop processes this line
          break
        }

        itemLines.push(nextLine)
        i++
      }

      items.push({
        index: itemMatch[2],
        lines: itemLines,
      })
    }
  }

  return items
}

interface CollapsibleArrayProps {
  logId: string
  content: string[]
  expandedItems: ExpandedItems
  onToggleItem: (logId: string, itemIndex: string) => void
}

function CollapsibleArray({
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
    <div className="space-y-2">
      {/* Header line */}
      {contentLines[0] && (
        <div className="bg-black/30 px-3 py-2 rounded overflow-x-auto">
          <SyntaxHighlighter text={contentLines[0]} />
        </div>
      )}

      {/* Array items */}
      <div className="ml-4 space-y-1">
        {items.map((item) => {
          const isExpanded = logExpandedItems.has(item.index)
          const hasDetails = item.lines.length > 1

          return (
            <div key={item.index}>
              {/* Item header with toggle button */}
              <button
                onClick={() => onToggleItem(logId, item.index)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded bg-black/30 hover:bg-black/40 transition-colors group"
              >
                {hasDetails && (
                  <span className="text-gray-400 group-hover:text-white flex-shrink-0">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                )}
                {!hasDetails && <span className="flex-shrink-0 w-4" />}
                <span className="flex-1 overflow-x-auto">
                  <SyntaxHighlighter text={item.lines[0]} />
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && hasDetails && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-3 py-2">
                  {item.lines.slice(1).map((line, idx) => (
                    <div
                      key={idx}
                      className="bg-black/20 px-3 py-1 rounded text-xs overflow-x-auto"
                    >
                      <SyntaxHighlighter text={line} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Closing bracket */}
      {contentLines[contentLines.length - 1] && (
        <div className="bg-black/30 px-3 py-2 rounded overflow-x-auto">
          <SyntaxHighlighter text={contentLines[contentLines.length - 1]} />
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isListening, setIsListening] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({})

  useEffect(() => {
    const unlisten = listen('log-entry', (event: any) => {
      const logEntry: LogEntry = event.payload
      setLogs((prev) => [logEntry, ...prev].slice(0, 100))
    })

    unlisten.then(() => {
      setIsListening(true)
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [])

  const clearLogs = () => setLogs([])

  const toggleExpanded = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const toggleItemExpanded = (logId: string, itemIndex: string) => {
    const newItems = { ...expandedItems }
    if (!newItems[logId]) {
      newItems[logId] = new Set<string>()
    }

    const logItems = new Set(newItems[logId])
    if (logItems.has(itemIndex)) {
      logItems.delete(itemIndex)
    } else {
      logItems.add(itemIndex)
    }
    newItems[logId] = logItems
    setExpandedItems(newItems)
  }

  const getPreview = (content: string[]) => {
    if (content.length === 0) return ''
    const firstLine = content[0]
    if (firstLine.length > 200) {
      return firstLine.substring(0, 200) + '...'
    }
    return firstLine
  }

  const shouldShowExpandButton = (content: string[]) => {
    return content.length > 1 || (content.length > 0 && content[0].length > 200)
  }

  const getLogBorderColor = (type: string) => {
    switch (type) {
      case 'info': return 'border-l-blue-500'
      case 'warning': return 'border-l-yellow-500'
      case 'error': return 'border-l-pink-600'
      default: return 'border-l-gray-600'
    }
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-pink-600'
      default: return 'text-white'
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f0f] text-white font-sans">
      <header className="flex justify-between items-center px-5 py-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-b border-[#2a2a4e] flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold mb-1">Akira Debugger</h1>
          <p className="text-xs text-gray-500">Real-time Laravel Ray logs</p>
        </div>
        <div className="flex gap-3 items-center">
          <span className={`text-xs px-3 py-1.5 rounded border ${
            isListening 
              ? 'text-[#56db3a] border-[#56db3a] bg-[#56db3a]/10' 
              : 'text-[#ff8400] border-[#ff8400] bg-[#ff8400]/10'
          }`}>
            {isListening ? 'Listening' : 'Waiting'}
          </span>
          <button 
            onClick={clearLogs} 
            className="px-4 py-1.5 text-xs bg-white/10 border border-white/20 text-white rounded cursor-pointer transition-all hover:bg-white/15 hover:border-white/30"
          >
            Clear
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-[#0f0f0f] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f0f0f] [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-[#555]">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">
            <p>Waiting for logs...</p>
          </div>
        ) : (
          logs.map((log) => {
            const isExpanded = expandedLogs.has(log.id)
            const hasMore = shouldShowExpandButton(log.content)
            const preview = getPreview(log.content)
            const displayContent = isExpanded ? log.content : [preview]

            return (
              <div key={log.id} className={`mb-4 p-3 px-4 bg-[#1a1a1a] border-l-4 ${getLogBorderColor(log.type)} rounded font-mono text-[13px] leading-relaxed overflow-hidden`}>
                <div className="flex gap-3 items-center mb-2 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 bg-white/5 rounded font-medium ${getLogTypeColor(log.type)}`}>
                    {log.type}
                  </span>
                  <span className="text-gray-600 text-[11px]">{log.location}</span>
                  <span className="ml-auto text-gray-700">{log.timestamp}</span>
                </div>
                <div className="mt-2">
                  {isArrayContent(displayContent as string[]) && isExpanded ? (
                    <CollapsibleArray
                      logId={log.id}
                      content={displayContent as string[]}
                      expandedItems={expandedItems}
                      onToggleItem={toggleItemExpanded}
                    />
                  ) : (
                    displayContent.map((line, idx) => (
                      <div
                        key={idx}
                        className="bg-black/30 px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words my-1 first:mt-0"
                      >
                        <SyntaxHighlighter text={line} />
                      </div>
                    ))
                  )}
                  {!isExpanded && hasMore && (
                    <div className="text-gray-600 text-[11px] px-3 py-2 mt-1 italic">
                      ... ({log.content.length} total lines)
                    </div>
                  )}
                </div>
                {hasMore && (
                  <button
                    onClick={() => toggleExpanded(log.id)}
                    className="mt-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/20 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    {isExpanded ? '▼ Collapse' : `▶ Expand (${log.content.length} lines)`}
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
