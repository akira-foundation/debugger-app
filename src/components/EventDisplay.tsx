import { useState } from 'react'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'
import { useLogStyle } from '../context/LogStyleContext'
import { SyntaxHighlighter } from '../utils/syntax'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

interface EventDisplayProps {
  content: string[]
}

interface PropertyRowProps {
  name: string
  value: any
  level?: number
}

function PropertyRow({ name, value, level = 0 }: PropertyRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatValue = (val: any): string => {
    if (val === null) return 'null'
    if (val === undefined) return 'undefined'
    if (typeof val === 'boolean') return val.toString()
    if (typeof val === 'string') return val
    if (typeof val === 'number') return val.toString()
    if (typeof val === 'object') {
      return JSON.stringify(val, null, 2)
    }
    return String(val)
  }

  const isExpandable = (val: any): boolean => {
    if (val === null || typeof val !== 'object') return false
    if (Array.isArray(val)) return val.length > 0
    return Object.keys(val).length > 0
  }

  const expandable = isExpandable(value)

  if (expandable) {
    const entries = Array.isArray(value) 
      ? value.map((item, idx) => [`${idx}`, item])
      : Object.entries(value)

    return (
      <div className="border-b border-white/5 last:border-b-0">
        <div 
          className="flex items-start gap-2 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <button className="text-gray-400 flex-shrink-0 mt-0.5">
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-gray-400 text-xs font-medium mb-1">{name}</div>
            {!isExpanded && (
              <div className="text-gray-500 text-xs truncate">
                {Array.isArray(value) ? `Array(${value.length})` : `Object {${Object.keys(value).length}}`}
              </div>
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="ml-8 border-l-2 border-white/10">
            {entries.map(([key, val]: [string, any]) => (
              <PropertyRow key={key} name={key} value={val} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-gray-400 text-xs font-medium mb-1">{name}</div>
        <div className="text-gray-200 text-xs break-words whitespace-pre-wrap font-mono">
          <SyntaxHighlighter text={formatValue(value)} />
        </div>
      </div>
    </div>
  )
}

export function EventDisplay({ content }: EventDisplayProps) {
  const { borderClass } = useLogStyle()
  const { copied, copy } = useCopyToClipboard()

  let eventName = ''
  let eventData: any = null

  if (content.length > 0) {
    try {
      const cleanedContent = content[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      const data = JSON.parse(cleanedContent)
      
      eventName = (data.event || data.name || '').replace(/\\\\/g, '\\')
      
      if (data.payload && typeof data.payload === 'object') {
        eventData = data.payload
      }
    } catch (e) {
      // Silently fail
    }
  }

  const handleCopy = () => {
    copy(content.join('\n'))
  }

  // Check if eventData is valid (must be an object with properties)
  const hasValidData = eventData && 
    typeof eventData === 'object' && 
    !Array.isArray(eventData) && 
    Object.keys(eventData).length > 0

  if (!hasValidData) {
    return (
      <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
        <div className="px-4 py-3 text-xs">
          <div className="text-gray-300 font-mono mb-2">
            <SyntaxHighlighter text={eventName} />
          </div>
          <div className="text-gray-500 text-xs">
            No additional event data
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="text-xs font-mono text-gray-300">
          <SyntaxHighlighter text={eventName} />
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
      <div>
        {Object.entries(eventData).map(([key, value]) => (
          <PropertyRow key={key} name={key} value={value} />
        ))}
      </div>
    </div>
  )
}
