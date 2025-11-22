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
    <div className="space-y-2">
      {/* Subject */}
      {subject && (
        <div className="glass bg-white/5 rounded-lg overflow-hidden border border-white/10">
          <div className="px-4 py-2">
            <span className="text-xs text-gray-400">Subject: </span>
            <span className="text-sm text-gray-200 font-mono">{subject}</span>
          </div>
        </div>
      )}

      {/* Recipients Info */}
      <div className="glass bg-white/5 rounded-lg overflow-hidden border border-white/10">
        <div className="px-4 py-3 space-y-2 text-xs">
          {from && from.length > 0 && (
            <div className="flex gap-2">
              <span className="text-gray-400 min-w-12">From:</span>
              <span className="text-gray-300">{formatAddresses(from)}</span>
            </div>
          )}
          {to && to.length > 0 && (
            <div className="flex gap-2">
              <span className="text-gray-400 min-w-12">To:</span>
              <span className="text-gray-300">{formatAddresses(to)}</span>
            </div>
          )}
          {cc && cc.length > 0 && (
            <div className="flex gap-2">
              <span className="text-gray-400 min-w-12">CC:</span>
              <span className="text-gray-300">{formatAddresses(cc)}</span>
            </div>
          )}
          {bcc && bcc.length > 0 && (
            <div className="flex gap-2">
              <span className="text-gray-400 min-w-12">BCC:</span>
              <span className="text-gray-300">{formatAddresses(bcc)}</span>
            </div>
          )}
        </div>
      </div>

      {/* HTML Content */}
      {html && (
        <div className="glass bg-white/5 rounded-lg overflow-hidden border border-white/10">
          <div className="px-4 py-2 bg-white/10 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">HTML Content</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              title="Copy HTML to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-xs text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="px-4 py-3">
            <div className="px-3 py-2 rounded overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs max-h-96 overflow-y-auto">
              <SyntaxHighlighter text={html.replace(/\\n/g, '\n').replace(/\\t/g, '\t')} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
