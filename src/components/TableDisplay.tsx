import { useLogStyle } from '../context/LogStyleContext'
import { SyntaxHighlighter } from '../utils/syntax'

interface TableDisplayProps {
  data: Record<string, any>
}

export function TableDisplay({ data }: TableDisplayProps) {
  const { borderClass } = useLogStyle()

  if (!data || Object.keys(data).length === 0) return null

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
          <tbody>
            {Object.entries(data).map(([key, value], idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 last:border-b-0"
              >
                <td className="px-4 py-3 text-gray-400 font-medium align-top whitespace-nowrap">
                  {key}
                </td>
                <td className="px-4 py-3 text-gray-200">
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
