import { describe, it, expect } from 'vitest'
import { 
  formatTimestamp, 
  parseTimestamp, 
  generateUuid, 
  hexToRgb, 
  rgbToHex, 
  hslToRgb, 
  rgbToHsl,
  testRegex,
  decodeJwt
} from './misc'

describe('formatTimestamp', () => {
  it('formats timestamp to ISO', () => {
    const result = formatTimestamp(1609459200000, 'ISO')
    expect(result).toBe('2021-01-01T00:00:00.000Z')
  })

  it('formats timestamp to UTC', () => {
    const result = formatTimestamp(1609459200000, 'UTC')
    expect(result).toContain('2021')
  })

  it('formats timestamp to locale', () => {
    const result = formatTimestamp(1609459200000, 'locale')
    expect(result).toBeTruthy()
  })

  it('formats timestamp to timestamp number', () => {
    const result = formatTimestamp(1609459200000, 'timestamp')
    expect(result).toBe('1609459200000')
  })

  it('formats to YYYY-MM-DD', () => {
    const result = formatTimestamp(1609459200000, 'YYYY-MM-DD')
    expect(result).toBe('2021-01-01')
  })

  it('formats to DD/MM/YYYY', () => {
    const result = formatTimestamp(1609459200000, 'DD/MM/YYYY')
    expect(result).toBe('01/01/2021')
  })

  it('formats to MM/DD/YYYY', () => {
    const result = formatTimestamp(1609459200000, 'MM/DD/YYYY')
    expect(result).toBe('01/01/2021')
  })

  it('throws on invalid timestamp', () => {
    expect(() => formatTimestamp('invalid')).toThrow('Invalid timestamp')
  })
})

describe('parseTimestamp', () => {
  it('parses numeric timestamp', () => {
    const result = parseTimestamp(1609459200000)
    expect(result).toBeInstanceOf(Date)
  })

  it('parses string timestamp', () => {
    const result = parseTimestamp('2021-01-01T00:00:00.000Z')
    expect(result).toBeInstanceOf(Date)
  })

  it('parses timestamp string', () => {
    const result = parseTimestamp('1609459200000')
    expect(result).toBeInstanceOf(Date)
  })

  it('returns null for invalid input', () => {
    const result = parseTimestamp('invalid')
    expect(result).toBeNull()
  })

  it('returns null for empty input', () => {
    const result = parseTimestamp('')
    expect(result).toBeNull()
  })
})

describe('generateUuid', () => {
  it('generates valid UUID v4 format', () => {
    const uuid = generateUuid()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('generates unique UUIDs', () => {
    const uuid1 = generateUuid()
    const uuid2 = generateUuid()
    expect(uuid1).not.toBe(uuid2)
  })
})

describe('hexToRgb', () => {
  it('converts hex to rgb', () => {
    const result = hexToRgb('#ff0000')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('converts lowercase hex', () => {
    const result = hexToRgb('#00ff00')
    expect(result).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('throws for invalid hex', () => {
    expect(() => hexToRgb('invalid')).toThrow('Invalid hex color format')
  })

  it('throws for missing hash', () => {
    const result = hexToRgb('ff0000')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('rgbToHex', () => {
  it('converts rgb to hex', () => {
    const result = rgbToHex(255, 0, 0)
    expect(result).toBe('#ff0000')
  })

  it('clamps values to 0-255', () => {
    const result = rgbToHex(300, -10, 128)
    expect(result).toBe('#ff0080')
  })

  it('throws for invalid input types', () => {
    expect(() => rgbToHex('a', 'b', 'c')).toThrow('Invalid RGB values')
  })
})

describe('hslToRgb', () => {
  it('converts red HSL to RGB', () => {
    const result = hslToRgb(0, 100, 50)
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('converts white HSL to RGB', () => {
    const result = hslToRgb(0, 0, 100)
    expect(result).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('throws for invalid input types', () => {
    expect(() => hslToRgb('a', 'b', 'c')).toThrow('Invalid HSL values')
  })
})

describe('rgbToHsl', () => {
  it('converts red RGB to HSL', () => {
    const result = rgbToHsl(255, 0, 0)
    expect(result.h).toBe(0)
    expect(result.s).toBe(100)
    expect(result.l).toBe(50)
  })

  it('converts white RGB to HSL', () => {
    const result = rgbToHsl(255, 255, 255)
    expect(result).toEqual({ h: 0, s: 0, l: 100 })
  })

  it('throws for invalid input types', () => {
    expect(() => rgbToHsl('a', 'b', 'c')).toThrow('Invalid RGB values')
  })
})

describe('testRegex', () => {
  it('finds matches', () => {
    const result = testRegex('hello', '', 'hello world')
    expect(result.valid).toBe(true)
    expect(result.matchCount).toBe(1)
  })

  it('finds multiple matches with global flag', () => {
    const result = testRegex('o', 'g', 'hello world')
    expect(result.matchCount).toBe(2)
  })

  it('returns empty array for no matches', () => {
    const result = testRegex('xyz', '', 'hello')
    expect(result.valid).toBe(true)
    expect(result.matchCount).toBe(0)
  })

  it('handles invalid regex', () => {
    const result = testRegex('[invalid', '', 'test')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('handles empty pattern', () => {
    const result = testRegex('', '', 'test')
    expect(result.valid).toBe(true)
    expect(result.matchCount).toBe(0)
  })

  it('rejects overly long patterns', () => {
    const longPattern = 'a'.repeat(501)
    const result = testRegex(longPattern, '', 'test')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too long')
  })

  it('rejects overly long test strings', () => {
    const result = testRegex('a', '', 'x'.repeat(50001))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too long')
  })
})

describe('decodeJwt', () => {
  it('decodes valid JWT', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const result = decodeJwt(token)
    expect(result.valid).toBe(true)
    expect(result.header.alg).toBe('HS256')
    expect(result.payload.name).toBe('John Doe')
  })

  it('handles invalid JWT format', () => {
    const result = decodeJwt('invalid')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Invalid JWT format')
  })

  it('handles malformed JWT parts', () => {
    const result = decodeJwt('a.b.c')
    expect(result.valid).toBe(false)
  })

  it('handles empty JWT', () => {
    const result = decodeJwt('')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('No token provided')
  })

  it('rejects oversized JWT', () => {
    const result = decodeJwt('x'.repeat(10001))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too long')
  })
})
