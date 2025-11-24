import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { LogEntry as LogEntryType, ExpandedItems } from '../types'
import { getPreferredEditor } from '../services/editorService'
import { LogStyleProvider } from '../context/LogStyleContext'
import { LogTypeRouter } from './LogTypeRouter'
import { getLevelStyles, getLabelColorStyles } from '../utils/styles'

interface LogEntryProps {
  log: LogEntryType
  isExpanded: boolean
  onToggleExpand: () => void
  expandedItems: ExpandedItems
  onToggleItem: (logId: string, itemIndex: string) => void
  shouldShowExpandButton: boolean
  getLogTypeColor: (type: string) => string
}


export function LogEntry({
  log,
  isExpanded,
  onToggleExpand,
  expandedItems,
  onToggleItem,
  shouldShowExpandButton,
                         }: LogEntryProps) {
  const [preferredEditor, setPreferredEditor] = useState<string | null>(null)
  const levelStyles = getLevelStyles(log.type)

  // Load preferred editor on mount
  useEffect(() => {
    const editor = getPreferredEditor()
    setPreferredEditor(editor || 'phpstorm')
  }, [])

  const handleOpenInEditor = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Use file_path if available, otherwise parse from location
      const filePath = log.file_path || log.location.split(':')[0]
      const line = log.location.split(':')[1]
      const lineNum = parseInt(line, 10) || 0
      const editor = preferredEditor || 'phpstorm'
      console.log('Opening file in editor:', { filePath, lineNum, editor })
      await invoke('open_in_editor_v2', {
        filePath: filePath,
        line: lineNum,
        editorId: editor,
      })
      console.log('File opened successfully')
    } catch (err) {
      console.error('Failed to open file in editor:', err)
    }
  }


  return (
    <div
      key={log.id}
      className={`glass card mb-2 font-mono text-[13px] leading-relaxed overflow-hidden group hover:shadow-sm hover:shadow-purple-500/20 backdrop-blur-lg border ${levelStyles.border}`}
    >
      {/* Header */}
      <div
        onClick={onToggleExpand}
        className="w-full text-left px-3 py-2 group cursor-pointer"
      >
        <div className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[10px] font-bold ${levelStyles.text}`}>
                {log.type.toUpperCase()}
              </span>
              <span className="text-gray-600 text-[10px]">{log.timestamp}</span>
              {log.type.toLowerCase() === 'executed_query' && (
                <span className="text-gray-500 text-[10px] whitespace-nowrap">SQL</span>
              )}
            </div>
            <button
              onClick={handleOpenInEditor}
              className="text-left text-gray-600 text-[10px] cursor-pointer hover:text-purple-400 hover:underline transition-colors p-0 bg-none border-none w-fit"
            >
              {log.location}
            </button>
          </div>
          {shouldShowExpandButton && (
            <button
              onClick={onToggleExpand}
              className="text-gray-500 group-hover:text-gray-300 flex-shrink-0 p-0 bg-none border-none cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          )}
          {log.pending_label && (() => {
            const labelColors = getLabelColorStyles(log.color)
            return (
              <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] border whitespace-nowrap flex-shrink-0 ${labelColors.border} ${labelColors.text} ${labelColors.bg}`}>
                {log.pending_label}
              </span>
            )
          })()}
        </div>
      </div>
      {isExpanded && (
        <LogStyleProvider borderClass={levelStyles.border} textClass={levelStyles.text}>
          <div className="px-0.5 pb-0.5 border-white/5 pt-1">
            <LogTypeRouter
              log={log}
              expandedItems={expandedItems}
              onToggleItem={onToggleItem}
            />
          </div>
        </LogStyleProvider>
      )}
    </div>
  )
}
