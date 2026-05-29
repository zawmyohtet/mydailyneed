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
