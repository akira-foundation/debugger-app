import { useState } from 'react'
import { ExpandedItems } from '../types'

export function useExpandedState() {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({})

  const toggleLogExpand = (logId: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev)
      if (next.has(logId)) {
        next.delete(logId)
      } else {
        next.add(logId)
      }
      return next
    })
  }

  const toggleItemExpand = (logId: string, itemIndex: string) => {
    setExpandedItems((prev) => {
      const logItems = prev[logId] || new Set<string>()
      const next = new Set(logItems)
      if (next.has(itemIndex)) {
        next.delete(itemIndex)
      } else {
        next.add(itemIndex)
      }
      return {
        ...prev,
        [logId]: next,
      }
    })
  }

  const expandAll = () => {
    setExpandedLogs(new Set()) // Will be set by caller if needed
  }

  const collapseAll = () => {
    setExpandedLogs(new Set())
    setExpandedItems({})
  }

  return {
    expandedLogs,
    expandedItems,
    toggleLogExpand,
    toggleItemExpand,
    expandAll,
    collapseAll,
  }
}
