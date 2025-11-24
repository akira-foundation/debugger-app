import { LogEntry } from '../types'
import { ExpandedItems } from '../types'
import { isArrayContent } from '../utils/array'
import { EloquentModelDisplay } from './EloquentModelDisplay'
import { ExecutedQueryDisplay } from './ExecutedQueryDisplay'
import { MailableDisplay } from './MailableDisplay'
import { CollapsibleArray } from './CollapsibleArray'
import { SimpleLogDisplay } from './SimpleLogDisplay'

interface LogTypeRouterProps {
  log: LogEntry
  expandedItems: ExpandedItems
  onToggleItem: (logId: string, itemIndex: string) => void
}

export function LogTypeRouter({ log, expandedItems, onToggleItem }: LogTypeRouterProps) {
  const logType = log.type.toLowerCase()

  if (logType === 'eloquent_model') {
    return (
      <EloquentModelDisplay
        content={log.content}
        logId={log.id}
        expandedItems={expandedItems}
        onToggleItem={onToggleItem}
      />
    )
  }

  if (logType === 'executed_query') {
    return <ExecutedQueryDisplay content={log.content} />
  }

  if (logType === 'mailable') {
    return <MailableDisplay content={log.content} />
  }

  if (isArrayContent(log.content as string[])) {
    return (
      <CollapsibleArray
        logId={log.id}
        content={log.content}
        expandedItems={expandedItems}
        onToggleItem={onToggleItem}
      />
    )
  }

  return <SimpleLogDisplay content={log.content} />
}
