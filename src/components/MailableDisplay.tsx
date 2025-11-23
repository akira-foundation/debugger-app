import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { SyntaxHighlighter } from '../utils/syntax'

interface MailableDisplayProps {
  content: string[]
}

export function MailableDisplay({ content }: MailableDisplayProps) {
  const [copied, setCopied] = useState(false)

  let mailData: any = {}

  // Parse JSON from first element
  if (content.length > 0) {
    try {
      mailData = JSON.parse(content[0])
    } catch (e) {
      console.error('Failed to parse mailable:', e)
      return null
    }
  }

  const to = mailData.to || []
  const cc = mailData.cc || []
  const bcc = mailData.bcc || []
  const from = mailData.from || []
  const subject = mailData.subject || 'No Subject'
  const html = mailData.html || ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html.replace(/\\n/g, '\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatAddresses = (addresses: any[]) => {
    if (!addresses || addresses.length === 0) return '—'
    return addresses.map(addr => {
      if (typeof addr === 'string') return addr
      return addr.address || addr.email || '—'
    }).join(', ')
  }

  return (
    <div className="rounded-lg overflow-hidden border border-white/10">
      {/* Header with Recipients and Copy Button */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="text-xs space-y-1">
          {subject && (
            <div>
              <span className="text-gray-400">Subject: </span>
              <span className="text-gray-200 font-mono">{subject}</span>
            </div>
          )}
          <div className="flex gap-4">
            {from && from.length > 0 && (
              <span className="text-gray-400">From: <span className="text-gray-200">{formatAddresses(from)}</span></span>
            )}
            {to && to.length > 0 && (
              <span className="text-gray-400">To: <span className="text-gray-200">{formatAddresses(to)}</span></span>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
          title="Copy HTML to clipboard"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* HTML Content */}
      {html && (
        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs">
            <SyntaxHighlighter text={html.replace(/\\n/g, '\n').replace(/\\t/g, '\t')} />
          </div>
        </div>
      )}
    </div>
  )
}
