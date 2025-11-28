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

function isArrayOfObjects(value: any): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  return value.every(item => item !== null && typeof item === 'object' && !Array.isArray(item))
}

function TableView({ data }: { data: any[] }) {
  if (data.length === 0) return null
  
  const columns = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map(col => (
              <th key={col} className="px-3 py-2 text-left text-gray-400 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              {columns.map(col => (
                <td key={col} className="px-3 py-2 text-gray-200 font-mono">
                  <SyntaxHighlighter text={String(row[col] ?? '')} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PropertyRow({ name, value, level = 0 }: PropertyRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree')

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
  const canShowTable = Array.isArray(value) && isArrayOfObjects(value)

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
            <div className="flex items-center gap-2">
              <div className="text-gray-400 text-xs font-medium">{name}</div>
              {canShowTable && isExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewMode(viewMode === 'tree' ? 'table' : 'tree')
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  {viewMode === 'tree' ? 'Table' : 'Tree'}
                </button>
              )}
            </div>
            {!isExpanded && (
              <div className="text-gray-500 text-xs truncate">
                {Array.isArray(value) ? `Array(${value.length})` : `Object (${Object.keys(value).length})`}
              </div>
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="ml-8">
            {canShowTable && viewMode === 'table' ? (
              <TableView data={value} />
            ) : (
              <div className="border-l-2 border-white/10">
                {entries.map(([key, val]: [string, any]) => (
                  <PropertyRow key={key} name={key} value={val} level={level + 1} />
                ))}
              </div>
            )}
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
        
        // Check if payload has array of similar objects that should be grouped
        const values = Object.values(eventData)
        if (values.length > 1 && 
            values.every(v => v && typeof v === 'object' && !Array.isArray(v))) {
          // Check if all objects have similar structure
          const keys = values.map(v => Object.keys(v as object).sort().join(','))
          const allSame = keys.every(k => k === keys[0])
          
          if (allSame) {
            // Group into an array for table view
            const groupedKey = Object.keys(eventData)[0]
            eventData = { [groupedKey]: values }
          }
        }
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
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-gray-400 font-medium w-1/4">Key</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eventData).map(([key, value]) => {
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

              return (
                <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-400 font-medium align-top">{key}</td>
                  <td className="px-4 py-3 text-gray-200 font-mono align-top break-words">
                    <SyntaxHighlighter text={formatValue(value)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
