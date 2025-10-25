import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import './App.css'

interface LogEntry {
  id: string
  timestamp: string
  type: string
  location: string
  content: string[]
  color?: RayColor
  pending_label?: string
}

interface ExpandedItems {
  [key: string]: Set<string>
}

// Ray color types
type RayColor = 'default' | 'purple' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'cyan' | 'pink'

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
      // Remove trailing opening bracket, curly braces, and hash references from first line
      const cleanedLine = line.replace(/\s+[\[\{].*$/, '').replace(/\s+\{#\d+\}\s*$/, '')
      const itemLines = [cleanedLine]
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

        // Remove closing bracket/brace if it's the last line
        const trimmedLine = nextLine.trim()
        if (trimmedLine !== ']' && trimmedLine !== '}') {
          itemLines.push(nextLine)
        }
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
      {/* Array items - clean display without header/closing brackets */}
      {items.map((item) => {
        const isExpanded = logExpandedItems.has(item.index)
        const hasDetails = item.lines.length > 1

        return (
          <div
            key={item.index}
            className="glass bg-black/30 rounded-lg transition-all backdrop-blur-md overflow-hidden"
          >
            {/* Item header with toggle button */}
            <button
              onClick={() => onToggleItem(logId, item.index)}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-black/20 transition-colors group"
            >
              {hasDetails && (
                <span className="text-purple-400 group-hover:text-purple-300 flex-shrink-0 font-bold text-sm">
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
              <span className="flex-1 overflow-x-auto text-gray-300">
                <SyntaxHighlighter text={item.lines[0]} />
              </span>
            </button>

            {/* Expanded content */}
            {isExpanded && hasDetails && (
              <div className="px-4 py-3 space-y-0 bg-black/20">
                {item.lines.slice(1).map((line, idx) => (
                  <div
                    key={idx}
                    className="text-[12px] overflow-x-auto text-dracula-foreground py-1"
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
  )
}

const rayColors: Record<RayColor, { bg: string; text: string; hex: string }> = {
  default: { bg: 'bg-gray-500', text: 'text-gray-300', hex: '#6b7280' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-300', hex: '#a855f7' },
  red: { bg: 'bg-red-500', text: 'text-red-300', hex: '#ef4444' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-300', hex: '#f97316' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-300', hex: '#eab308' },
  green: { bg: 'bg-green-500', text: 'text-green-300', hex: '#22c55e' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-300', hex: '#3b82f6' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-300', hex: '#06b6d4' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-300', hex: '#ec4899' },
}

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isListening, setIsListening] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({})
  const [selectedColor, setSelectedColor] = useState<RayColor | null>(null)

  useEffect(() => {
    const unlistenLog = listen('log-entry', (event: any) => {
      const logEntry: LogEntry = event.payload
      setLogs((prev) => [logEntry, ...prev].slice(0, 100))
    })

    const unlistenLabel = listen('attach-label', (event: any) => {
      const { label } = event.payload
      // Attach label to the first (most recent) log
      setLogs((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        updated[0] = {
          ...updated[0],
          pending_label: label,
        }
        return updated
      })
    })

    const unlistenColor = listen('attach-color', (event: any) => {
      const { color } = event.payload
      // Attach color to the first (most recent) log
      setLogs((prev) => {
        if (prev.length === 0) return prev
        const updated = [...prev]
        updated[0] = {
          ...updated[0],
          color: color as RayColor,
        }
        return updated
      })
    })

    Promise.all([unlistenLog, unlistenLabel, unlistenColor]).then(() => {
      setIsListening(true)
    })

    return () => {
      Promise.all([unlistenLog, unlistenLabel, unlistenColor]).then(([fn1, fn2, fn3]) => {
        fn1()
        fn2()
        fn3()
      })
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
      case 'info': return 'text-blue-400'
      case 'warning': return 'text-dracula-orange'
      case 'error': return 'text-dracula-red'
      default: return 'text-dracula-foreground'
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f0f] text-white font-sans">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#1a1a2a]/80 via-[#1a0f2e]/80 to-[#0f0f0f]/80 backdrop-blur-xl flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">
          Akira Debugger
        </h1>
        <div className="flex gap-3 items-center">
          <span className={`text-xs px-4 py-2 rounded-full font-semibold transition-all ${
            isListening
              ? 'bg-green-500/20 text-green-400'
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {isListening ? '● Listening' : '○ Waiting'}
          </span>
          <button
            onClick={clearLogs}
            className="px-4 py-2 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Color filter tabs */}
      <div className="flex gap-2 px-6 py-3 bg-[#0f0f0f]/50 border-b border-white/5 overflow-x-auto">
        <button
          onClick={() => setSelectedColor(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
            selectedColor === null
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          All
        </button>
        {Object.entries(rayColors).map(([color, styles]) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color as RayColor)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${styles.bg} ${
              selectedColor === color ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
            }`}
            title={color}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-[#0f0f0f] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f0f0f] [&::-webkit-scrollbar-thumb]:bg-purple-600/40 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-purple-600/60">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">
            <p>Waiting for logs...</p>
          </div>
        ) : (
          [...logs]
            .reverse()
            .filter((log) => {
              // Always hide 'color' type logs from display
              if (log.type === 'color') return false
              // If no color filter selected, show all non-color logs
              if (!selectedColor) return true
              // Filter by color
              return (log.color || 'default') === selectedColor
            })
            .map((log) => {
              const hasMore = shouldShowExpandButton(log.content)
              const isExpanded = hasMore ? expandedLogs.has(log.id) : true

              return (
              <div
                key={log.id}
                className="glass card mb-4 font-mono text-[13px] leading-relaxed overflow-hidden group hover:shadow-lg hover:shadow-purple-500/30 backdrop-blur-lg"
              >
                {/* Clickable header to toggle expand */}
                <button
                  onClick={() => toggleExpanded(log.id)}
                  className="w-full text-left p-4 hover:bg-black/20 transition-colors flex gap-3 items-center group flex-wrap"
                >
                  {hasMore && (
                    <span className="text-purple-400 group-hover:text-purple-300 flex-shrink-0 font-bold text-sm">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  )}
                  <div className="flex gap-3 items-center flex-1 text-xs text-gray-400 flex-wrap w-full">
                    <span className={`px-3 py-1 rounded-full font-semibold text-[11px] ${getLogTypeColor(log.type)} bg-white/5 group-hover:bg-white/10 transition-colors`}>
                      {log.type.toUpperCase()}
                    </span>
                    {log.pending_label && (
                      <span className="px-3 py-1 rounded-full font-semibold text-[11px] border border-purple-500/50 text-purple-400 bg-purple-500/10">
                        {log.pending_label}
                      </span>
                    )}
                    <span className="text-gray-600 text-[11px]">{log.location}</span>
                    <span className="ml-auto text-gray-600 text-[11px] font-mono">{log.timestamp}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4">
                    {isArrayContent(log.content as string[]) ? (
                      <CollapsibleArray
                        logId={log.id}
                        content={log.content}
                        expandedItems={expandedItems}
                        onToggleItem={toggleItemExpanded}
                      />
                    ) : (
                      <div className="space-y-2">
                        {log.content.map((line, idx) => (
                          <div
                            key={idx}
                            className="bg-black/30 px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words"
                          >
                            <SyntaxHighlighter text={line} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
