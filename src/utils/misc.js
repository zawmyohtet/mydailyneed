export function formatTimestamp(timestamp, format = 'ISO') {
  const date = new Date(timestamp)
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp')
  }

  switch (format) {
    case 'ISO':
      return date.toISOString()
    case 'UTC':
      return date.toUTCString()
    case 'locale':
      return date.toLocaleString()
    case 'timestamp':
      return date.getTime().toString()
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0]
    case 'DD/MM/YYYY':
      const d = date.getDate().toString().padStart(2, '0')
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const y = date.getFullYear()
      return `${d}/${m}/${y}`
    case 'MM/DD/YYYY':
      const mm = (date.getMonth() + 1).toString().padStart(2, '0')
      const dd = date.getDate().toString().padStart(2, '0')
      const yy = date.getFullYear()
      return `${mm}/${dd}/${yy}`
    default:
      return date.toISOString()
  }
}

export function parseTimestamp(input) {
  if (!input) return null
  
  if (typeof input === 'string' && input.length > 100) {
    return null
  }
  
  const num = Number(input)
  if (!isNaN(num)) {
    const date = new Date(num)
    if (!isNaN(date.getTime())) return date
  }

  const date = new Date(input)
  if (!isNaN(date.getTime())) return date

  return null
}

export function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'))
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`
}

export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') {
    throw new Error('Invalid hex color: input must be a string')
  }
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error(`Invalid hex color format: ${hex}. Expected format: #RRGGBB`)
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

export function rgbToHex(r, g, b) {
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    throw new Error('Invalid RGB values: all components must be numbers')
  }
  
  const toHex = (c) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

export function hslToRgb(h, s, l) {
  if (typeof h !== 'number' || typeof s !== 'number' || typeof l !== 'number') {
    throw new Error('Invalid HSL values: all components must be numbers')
  }
  
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

export function rgbToHsl(r, g, b) {
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    throw new Error('Invalid RGB values: all components must be numbers')
  }
  
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

export function testRegex(pattern, flags, testString) {
  try {
    const MAX_PATTERN_LENGTH = 500
    const MAX_STRING_LENGTH = 50000
    
    if (!pattern) {
      return { valid: true, matches: [], matchCount: 0, error: null }
    }
    
    if (pattern.length > MAX_PATTERN_LENGTH) {
      return { valid: false, matches: [], matchCount: 0, error: 'Pattern too long (max 500 characters)' }
    }
    
    if (testString.length > MAX_STRING_LENGTH) {
      return { valid: false, matches: [], matchCount: 0, error: 'Test string too long (max 50,000 characters)' }
    }
    
    const regex = new RegExp(pattern, flags)
    
    const startTime = performance.now()
    const matches = testString.match(regex)
    const elapsed = performance.now() - startTime
    
    if (elapsed > 2000) {
      return { valid: true, matches: [], matchCount: 0, error: 'Pattern timed out (too complex)' }
    }
    
    const globalMatches = flags.includes('g') ? matches : (matches ? [matches[0]] : null)
    
    return {
      valid: true,
      matches: globalMatches || [],
      matchCount: globalMatches ? globalMatches.length : 0,
      error: null
    }
  } catch (e) {
    return {
      valid: false,
      matches: [],
      matchCount: 0,
      error: e.message
    }
  }
}

export function decodeJwt(token) {
  try {
    if (!token || token.length > 10000) {
      return { valid: false, error: token ? 'JWT too long (max 10,000 characters)' : 'No token provided' }
    }
    
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid JWT format' }
    }
    
    const decodePart = (part) => {
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
      const json = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''))
      return JSON.parse(json)
    }
    
    const header = decodePart(parts[0])
    const payload = decodePart(parts[1])
    
    return {
      valid: true,
      header,
      payload,
      signature: parts[2],
      error: null
    }
  } catch (e) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: null,
      error: `Invalid JWT: ${e.message}`
    }
  }
}
