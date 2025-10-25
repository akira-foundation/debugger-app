export type RayColor = 'default' | 'purple' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'cyan' | 'pink'

export interface LogEntry {
  id: string
  timestamp: string
  type: string
  location: string
  content: string[]
  color?: RayColor
  pending_label?: string
}

export interface ExpandedItems {
  [key: string]: Set<string>
}

export const rayColors: Record<RayColor, { bg: string; text: string; hex: string }> = {
  default: { bg: 'bg-gray-600', text: 'text-gray-300', hex: '#4B5563' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-200', hex: '#BD93F9' },
  red: { bg: 'bg-red-500', text: 'text-red-200', hex: '#FF5555' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-200', hex: '#FFB86C' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-200', hex: '#F1FA8C' },
  green: { bg: 'bg-green-500', text: 'text-green-200', hex: '#50FA7B' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-200', hex: '#8BE9FD' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-200', hex: '#8BE9FD' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-200', hex: '#FF79C6' },
}
