import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Copy, Check } from 'lucide-react'
import { LogEntry as LogEntryType, ExpandedItems } from '../types'
import { isArrayContent, isEloquentModel } from '../utils/array'
import { SyntaxHighlighter } from '../utils/syntax'
import { CollapsibleArray } from './CollapsibleArray'
import { EloquentModelDisplay } from './EloquentModelDisplay'
import { ExecutedQueryDisplay } from './ExecutedQueryDisplay'
import { MailableDisplay } from './MailableDisplay'

interface LogEntryProps {
  log: LogEntryType
  isExpanded: boolean
  onToggleExpand: () => void
  expandedItems: ExpandedItems
  onToggleItem: (logId: string, itemIndex: string) => void
  shouldShowExpandButton: boolean
  getLogTypeColor: (type: string) => string
}

function getLevelStyles(type: string): { border: string; dot: string; text: string } {
  const styleMap: Record<string, { border: string; dot: string; text: string }> = {
    info: { border: 'border-emerald-500/30', dot: 'bg-emerald-500', text: 'text-emerald-400' },
    debug: { border: 'border-cyan-500/30', dot: 'bg-cyan-500', text: 'text-cyan-400' },
    error: { border: 'border-red-500/30', dot: 'bg-red-500', text: 'text-red-400' },
    warning: { border: 'border-purple-500/30', dot: 'bg-purple-500', text: 'text-purple-400' },
  }

  return styleMap[type.toLowerCase()] || styleMap['info']
}

function getLabelColorStyles(logColor: string | undefined) {
  const colorMap: Record<string, { border: string; text: string; bg: string }> = {
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

  const color = logColor || 'default'
  return colorMap[color] || colorMap['default']
}

export function LogEntry({
  log,
  isExpanded,
  onToggleExpand,
  expandedItems,
  onToggleItem,
  shouldShowExpandButton,
  getLogTypeColor,
}: LogEntryProps) {
  const [copied, setCopied] = useState(false)
  const levelStyles = getLevelStyles(log.type)

  const handleOpenInEditor = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Use file_path if available, otherwise parse from location
      const filePath = log.file_path || log.location.split(':')[0]
      const line = log.location.split(':')[1]
      const lineNum = parseInt(line, 10) || 0
      await invoke('open_in_editor', { filePath, line: lineNum })
    } catch (err) {
      console.error('Failed to open file in editor:', err)
    }
  }

  const handleCopyLog = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const logContent = log.content.join('\n')
    try {
      await navigator.clipboard.writeText(logContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy log:', err)
    }
  }

  return (
    <div
      key={log.id}
      className={`glass card mb-2 font-mono text-[13px] leading-relaxed overflow-hidden group hover:shadow-md hover:shadow-purple-500/20 backdrop-blur-lg border ${levelStyles.border}`}
    >
      {/* Clickable header to toggle expand */}
      <button
        onClick={onToggleExpand}
        className="w-full text-left px-3 py-3 hover:bg-black/10 transition-colors flex gap-3 items-center group"
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${levelStyles.dot}`} />
          <span className={`font-mono text-[11px] font-bold ${levelStyles.text}`}>
            {log.type.toUpperCase()}
          </span>
        </div>
        <span className="text-gray-500 text-[11px] flex-1">{log.timestamp}</span>
        {log.type.toLowerCase() === 'executed_query' && (
          <span className="text-gray-400 text-[11px] whitespace-nowrap flex-shrink-0">SQL</span>
        )}
        <span
          onClick={handleOpenInEditor}
          className="text-gray-600 text-[11px] cursor-pointer hover:text-purple-400 hover:underline transition-colors whitespace-nowrap flex-shrink-0"
          title="Click to open in PhpStorm"
        >
          {log.location}
        </span>
        <button
          onClick={handleCopyLog}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Copy log content"
        >
          {copied ? (
            <Check size={13} className="text-green-400" />
          ) : (
            <Copy size={13} className="text-gray-400 hover:text-gray-300" />
          )}
        </button>
        {shouldShowExpandButton && (
          <span className="text-gray-500 group-hover:text-gray-300 flex-shrink-0 text-sm">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {log.pending_label && (() => {
          const labelColors = getLabelColorStyles(log.color)
          return (
            <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] border whitespace-nowrap flex-shrink-0 ${labelColors.border} ${labelColors.text} ${labelColors.bg}`}>
              {log.pending_label}
            </span>
          )
        })()}
      </button>
      {isExpanded && (
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          {log.type.toLowerCase() === 'eloquent_model' ? (
            <EloquentModelDisplay
              content={log.content}
              logId={log.id}
              expandedItems={expandedItems}
              onToggleItem={onToggleItem}
            />
          ) : log.type.toLowerCase() === 'executed_query' ? (
            <ExecutedQueryDisplay content={log.content} />
          ) : log.type.toLowerCase() === 'mailable' ? (
            <MailableDisplay content={log.content} />
          ) : isArrayContent(log.content as string[]) ? (
            <CollapsibleArray
              logId={log.id}
              content={log.content}
              expandedItems={expandedItems}
              onToggleItem={onToggleItem}
            />
          ) : (
            <div className="space-y-2">
              {log.content.map((line, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words"
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
}
