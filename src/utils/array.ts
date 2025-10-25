export function isArrayContent(content: string[]): boolean {
  if (content.length < 1) return false
  // Check if first line looks like array header
  const firstLine = content[0]
  return (
    firstLine.includes('array:') ||
    firstLine.includes('Collection') ||
    firstLine.includes('Illuminate\\Database')
  )
}

export function parseArrayItems(content: string[]): Array<{ index: string; lines: string[] }> {
  const items: Array<{ index: string; lines: string[] }> = []

  for (let i = 1; i < content.length; i++) {
    const line = content[i]
    // Match: "  0 => array:3 [" or "  0 => App\Model"
    const itemMatch = line.match(/^(\s+)(\d+)\s+=>/)

    if (itemMatch) {
      // Remove trailing opening bracket, curly braces, and hash references from first line
      const cleanedLine = line.replace(/\s+[\[\{].*$/, '').replace(/\s+\{#\d+\}\s*$/, '')
      const itemLines = [cleanedLine]
      const itemIndent = itemMatch[1].length

      // Collect all following lines until we find the next item at same indent level
      i++
      while (i < content.length) {
        const nextLine = content[i]

        // Check if this line is a new item (same pattern at same indentation)
        const nextItemMatch = nextLine.match(/^(\s+)(\d+)\s+=>/)
        if (nextItemMatch && nextItemMatch[1].length === itemIndent) {
          i-- // Back up so outer loop processes this line
          break
        }

        // Remove closing bracket/brace if it's the last line
        const trimmedLine = nextLine.trim()
        if (trimmedLine !== ']' && trimmedLine !== '}') {
          itemLines.push(nextLine)
        }
        i++
      }

      items.push({
        index: itemMatch[2],
        lines: itemLines,
      })
    }
  }

  return items
}
