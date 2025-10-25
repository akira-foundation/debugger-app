export function HighlightedLine({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let i = 0

  while (i < text.length) {
    // Handle strings (with quotes)
    if (text[i] === '"') {
      let j = i + 1
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\') j++
        j++
      }
      parts.push(
        <span key={i} className="syntax-string">
          {text.substring(i, j + 1)}
        </span>
      )
      i = j + 1
    }
    // Handle numbers
    else if (/\d/.test(text[i])) {
      let j = i
      while (j < text.length && /[\d.eE+-]/.test(text[j])) j++
      parts.push(
        <span key={i} className="syntax-number">
          {text.substring(i, j)}
        </span>
      )
      i = j
    }
    // Handle booleans and null
    else if (text.substring(i, i + 4) === 'true') {
      parts.push(
        <span key={i} className="syntax-boolean">
          true
        </span>
      )
      i += 4
    } else if (text.substring(i, i + 5) === 'false') {
      parts.push(
        <span key={i} className="syntax-boolean">
          false
        </span>
      )
      i += 5
    } else if (text.substring(i, i + 4) === 'null') {
      parts.push(
        <span key={i} className="syntax-null">
          null
        </span>
      )
      i += 4
    }
    // Handle brackets and braces with color
    else if (text[i] === '{' || text[i] === '}' || text[i] === '[' || text[i] === ']') {
      parts.push(
        <span key={i} className="text-blue-400">
          {text[i]}
        </span>
      )
      i++
    }
    // Handle colons
    else if (text[i] === ':') {
      parts.push(
        <span key={i} className="text-gray-400">
          {text[i]}
        </span>
      )
      i++
    }
    // Handle commas
    else if (text[i] === ',') {
      parts.push(
        <span key={i} className="text-gray-400">
          {text[i]}
        </span>
      )
      i++
    }
    // Default
    else {
      parts.push(text[i])
      i++
    }
  }

  return <>{parts}</>
}

export function SyntaxHighlighter({ text }: { text: string }) {
  const isJson = text.trim().startsWith('{') || text.trim().startsWith('[')

  if (isJson) {
    try {
      JSON.parse(text)
      // Valid JSON - format and highlight line by line
      const formatted = JSON.stringify(JSON.parse(text), null, 2)
      return (
        <pre className="syntax-highlight json">
          {formatted.split('\n').map((line, idx) => (
            <div key={idx}>
              <HighlightedLine text={line} />
            </div>
          ))}
        </pre>
      )
    } catch {
      // Not valid JSON, treat as plain text
    }
  }

  // Check if it looks like a single value
  const trimmed = text.trim()
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return <span className="syntax-number">{text}</span>
  }
  if (/^(true|false)$/i.test(trimmed)) {
    return <span className="syntax-boolean">{text}</span>
  }
  if (/^null$/i.test(trimmed)) {
    return <span className="syntax-null">{text}</span>
  }

  // Default: PHP dump format with basic highlighting
  return (
    <pre className="syntax-highlight php-dump">
      {text.split('\n').map((line, idx) => (
        <div key={idx}>
          <HighlightedLine text={line} />
        </div>
      ))}
    </pre>
  )
}
