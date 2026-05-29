export function encodeBase64(input) {
  if (!input) return ''
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function decodeBase64(input) {
  if (!input) return ''
  try {
    const binary = atob(input.trim())
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch (e) {
    throw new Error('Invalid Base64 input', { cause: e })
  }
}

export function encodeUrl(input, mode = 'component') {
  if (!input) return ''
  return mode === 'full' ? encodeURI(input) : encodeURIComponent(input)
}

export function decodeUrl(input, mode = 'component') {
  if (!input) return ''
  try {
    return mode === 'full' ? decodeURI(input) : decodeURIComponent(input)
  } catch (e) {
    throw new Error('Invalid encoded input', { cause: e })
  }
}

export function countStats(text) {
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
  const lines = text.split(/\n/).length
  const readingTime = Math.ceil(words / 200)
  
  return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTime }
}

export function findDuplicates(input, options = {}) {
  const { trim = true, caseSensitive = true } = options

  if (!input || !input.trim()) {
    return { duplicates: [], counts: {}, totalItems: 0, totalDuplicateItems: 0 }
  }

  let items = input.split(/[,\n]+/).filter(item => item.trim() !== '')

  if (trim) {
    items = items.map(item => item.trim())
  }

  if (!caseSensitive) {
    items = items.map(item => item.toLowerCase())
  }

  const counts = {}
  const seen = new Set()
  const duplicates = []

  for (const item of items) {
    counts[item] = (counts[item] || 0) + 1
    if (counts[item] > 1 && !seen.has(item)) {
      seen.add(item)
      duplicates.push(item)
    }
  }

  const duplicateCounts = {}
  for (const [item, count] of Object.entries(counts)) {
    if (count > 1) {
      duplicateCounts[item] = count
    }
  }

  return {
    duplicates,
    counts: duplicateCounts,
    totalItems: items.length,
    totalDuplicateItems: duplicates.length,
  }
}

export function multilineToCommaList(input, options = {}) {
  const { separator = ', ', trimWhitespace = true, removeEmpty = true } = options

  if (!input) return ''

  let lines = input.split('\n')

  if (trimWhitespace) {
    lines = lines.map(line => line.trim())
  }

  if (removeEmpty) {
    lines = lines.filter(line => line.length > 0)
  }

  return lines.join(separator)
}

import { diffLines, diffWords } from 'diff'

export function computeDiff(left, right, mode = 'line') {

  if (!left && !right) return { left: [], right: [] }

  const lineDiffs = diffLines(left || '', right || '')

  if (mode === 'line') {
    const leftChunks = []
    const rightChunks = []

    for (const part of lineDiffs) {
      const lines = part.value.split('\n')
      if (lines[lines.length - 1] === '') lines.pop()

      for (const line of lines) {
        if (part.added) {
          leftChunks.push({ type: 'empty', value: '' })
          rightChunks.push({ type: 'added', value: line })
        } else if (part.removed) {
          leftChunks.push({ type: 'removed', value: line })
          rightChunks.push({ type: 'empty', value: '' })
        } else {
          leftChunks.push({ type: 'unchanged', value: line })
          rightChunks.push({ type: 'unchanged', value: line })
        }
      }
    }

    return { left: leftChunks, right: rightChunks }
  }

  const leftChunks = []
  const rightChunks = []

  for (const part of lineDiffs) {
    if (part.added || part.removed) {
      const words = diffWords(
        part.removed ? part.value : '',
        part.added ? part.value : ''
      )

      for (const w of words) {
        if (w.added) {
          leftChunks.push({ type: 'empty', value: '' })
          rightChunks.push({ type: 'added', value: w.value })
        } else if (w.removed) {
          leftChunks.push({ type: 'removed', value: w.value })
          rightChunks.push({ type: 'empty', value: '' })
        } else {
          leftChunks.push({ type: 'unchanged', value: w.value })
          rightChunks.push({ type: 'unchanged', value: w.value })
        }
      }
    } else {
      const lines = part.value.split('\n')
      if (lines[lines.length - 1] === '') lines.pop()

      for (const line of lines) {
        leftChunks.push({ type: 'unchanged', value: line })
        rightChunks.push({ type: 'unchanged', value: line })
      }
    }
  }

  return { left: leftChunks, right: rightChunks }
}

export function convertCase(text, format) {
  if (!text) return ''
  
  const words = text.trim().split(/\s+/).filter(w => w)
  
  switch (format) {
    case 'UPPERCASE':
      return text.toUpperCase()
    case 'lowercase':
      return text.toLowerCase()
    case 'Title Case':
      return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    case 'Sentence case':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    case 'camelCase':
      return words.map((w, i) => 
        i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()
      ).join('')
    case 'PascalCase':
      return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
    case 'snake_case':
      return words.map(w => w.toLowerCase()).join('_')
    case 'kebab-case':
      return words.map(w => w.toLowerCase()).join('-')
    case 'CONSTANT_CASE':
      return words.map(w => w.toUpperCase()).join('_')
    default:
      return text
  }
}
