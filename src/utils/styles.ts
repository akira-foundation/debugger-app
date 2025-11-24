import { logTypes } from '../types'
import { getLogBorderConfig } from '../services/logBorderConfigService'

export const colorStyleMap: Record<string, { border: string; dot: string; text: string }> = {
  purple: { border: 'border-purple-500/30', dot: 'bg-purple-500', text: 'text-purple-400' },
  red: { border: 'border-red-500/30', dot: 'bg-red-500', text: 'text-red-400' },
  orange: { border: 'border-orange-500/30', dot: 'bg-orange-500', text: 'text-orange-400' },
  yellow: { border: 'border-yellow-500/30', dot: 'bg-yellow-500', text: 'text-yellow-400' },
  green: { border: 'border-green-500/30', dot: 'bg-green-500', text: 'text-green-400' },
  blue: { border: 'border-blue-500/30', dot: 'bg-blue-500', text: 'text-blue-400' },
  cyan: { border: 'border-cyan-500/30', dot: 'bg-cyan-500', text: 'text-cyan-400' },
  pink: { border: 'border-pink-500/30', dot: 'bg-pink-500', text: 'text-pink-400' },
}

export function getLevelStyles(type: string): { border: string; dot: string; text: string } {
  const config = getLogBorderConfig()
  const logType = logTypes[type.toLowerCase() as keyof typeof logTypes]

  if (config.mode === 'unified' && config.unifiedColor && config.unifiedColor in colorStyleMap) {
    return colorStyleMap[config.unifiedColor]
  }

  if (logType) {
    return {
      border: logType.border,
      dot: logType.dot,
      text: logType.color,
    }
  }

  return {
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
  }
}

export const labelColorStyles: Record<string, { border: string; text: string; bg: string }> = {
  default: { border: 'border-gray-600/50', text: 'text-gray-300', bg: 'bg-gray-600/10' },
  purple: { border: 'border-purple-500/50', text: 'text-purple-300', bg: 'bg-purple-500/10' },
  red: { border: 'border-red-500/50', text: 'text-red-300', bg: 'bg-red-500/10' },
  orange: { border: 'border-orange-500/50', text: 'text-orange-300', bg: 'bg-orange-500/10' },
  yellow: { border: 'border-yellow-500/50', text: 'text-yellow-300', bg: 'bg-yellow-500/10' },
  green: { border: 'border-green-500/50', text: 'text-green-300', bg: 'bg-green-500/10' },
  blue: { border: 'border-blue-500/50', text: 'text-blue-300', bg: 'bg-blue-500/10' },
  cyan: { border: 'border-cyan-500/50', text: 'text-cyan-300', bg: 'bg-cyan-500/10' },
  pink: { border: 'border-pink-500/50', text: 'text-pink-300', bg: 'bg-pink-500/10' },
}

export function getLabelColorStyles(logColor: string | undefined) {
  const color = logColor || 'default'
  return labelColorStyles[color] || labelColorStyles['default']
}
