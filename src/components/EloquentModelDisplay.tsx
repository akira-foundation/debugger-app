import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'
import { ExpandedItems } from '../types'

interface EloquentModelDisplayProps {
  content: string[]
  logId?: string
  expandedItems?: ExpandedItems
  onToggleItem?: (logId: string, itemIndex: string) => void
}

export function EloquentModelDisplay({
  content,
  logId = '',
  expandedItems = {},
  onToggleItem = () => {}
}: EloquentModelDisplayProps) {
  const [isAttributesExpanded, setIsAttributesExpanded] = useState(true)

  let className = ''
  let attributeLines: string[] = []

  // The content is a JSON object in a single string
  if (content.length > 0) {
    try {
      const jsonStr = content[0]
      const data = JSON.parse(jsonStr)

      // Extract class name
      if (data.class_name) {
        className = data.class_name
      }

      // Extract and parse attributes
      if (data.attributes) {
        // Parse the attributes string - format: array:N [\n "key" => value\n ...
        const attributesStr = data.attributes

        // Find array header
        const headerMatch = attributesStr.match(/array:\d+\s*\[/)
        if (headerMatch) {
          // Split by actual newline characters
          const lines = attributesStr.split('\n').filter(l => l.trim())

          for (const line of lines) {
            const trimmed = line.trim().replace(/\\"/g, '"')
            // Skip header and closing bracket
            if (trimmed.startsWith('array:') || trimmed === ']') continue

            // Each line is: "key" => value
            if (trimmed) {
              attributeLines.push('  ' + trimmed)
            }
          }
        }
      }
    } catch (e) {
      // If JSON parse fails, fall through to debug view
      console.error('Failed to parse eloquent model JSON:', e)
    }
  }

  return (
    <div className="space-y-2">
      {/* Class Name Section */}
      {className && (
        <div className="rounded-lg overflow-hidden border border-white/10">
          <div className="px-4 py-2">
            <div className="text-sm text-dracula-foreground font-mono">
              <SyntaxHighlighter text={className} />
            </div>
          </div>
        </div>
      )}

      {/* Attributes Section */}
      {attributeLines.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-white/10">
          <button
            onClick={() => setIsAttributesExpanded(!isAttributesExpanded)}
            className="w-full px-4 py-2 border-b border-white/5 flex items-center justify-between"
          >
            <span className="text-xs font-medium text-gray-400">Attributes</span>
            <span className="text-gray-500">
              {isAttributesExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </span>
          </button>
          {isAttributesExpanded && (
            <div className="px-4 py-3">
              <div className="px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">
                {attributeLines.map((line, idx) => (
                  <div key={idx}>
                    <SyntaxHighlighter text={line} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
