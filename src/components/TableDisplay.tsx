import { useLogStyle } from '../context/LogStyleContext'
import { SyntaxHighlighter } from '../utils/syntax'

interface TableDisplayProps {
  data: Record<string, any>
}

export function TableDisplay({ data }: TableDisplayProps) {
  const { borderClass } = useLogStyle()

  if (!data) return null

  // Check if data has the Ray table format: { values: [], label: [] }
  if (data.values && Array.isArray(data.values) && data.label && Array.isArray(data.label)) {
    const headers = data.label
    const rows = data.values

    return (
      <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10">
                {headers.map((header: string, idx: number) => (
                  <th key={idx} className="px-4 py-3 text-left text-gray-400 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any[], rowIdx: number) => (
                <tr key={rowIdx} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                  {row.map((cell: any, cellIdx: number) => (
                    <td key={cellIdx} className="px-4 py-3 text-gray-200 align-top whitespace-pre-wrap">
                      {cell === null ? 'null' : cell === undefined ? 'undefined' : typeof cell === 'object' ? JSON.stringify(cell, null, 2) : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Fallback: render as key-value table
  const formatValue = (value: any): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${borderClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-gray-400 font-medium w-1/4">Key</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value], idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 last:border-b-0 hover:bg-white/5"
              >
                <td className="px-4 py-3 text-gray-400 font-medium align-top">
                  {key}
                </td>
                <td className="px-4 py-3 text-gray-200 align-top">
                  <div className="whitespace-pre-wrap break-words">
                    <SyntaxHighlighter text={formatValue(value)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
