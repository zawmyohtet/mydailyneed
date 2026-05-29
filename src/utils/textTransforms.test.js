import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64, encodeUrl, decodeUrl, countStats, convertCase, findDuplicates } from './textTransforms'

describe('encodeBase64', () => {
  it('encodes simple text', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=')
  })

  it('encodes UTF-8 characters', () => {
    expect(encodeBase64('你好')).toBe('5L2g5aW9')
  })

  it('handles empty input', () => {
    expect(encodeBase64('')).toBe('')
    expect(encodeBase64(null)).toBe('')
    expect(encodeBase64(undefined)).toBe('')
  })

  it('encodes special characters', () => {
    expect(encodeBase64('Hello World!')).toBe('SGVsbG8gV29ybGQh')
  })
})

describe('decodeBase64', () => {
  it('decodes simple text', () => {
    expect(decodeBase64('SGVsbG8=')).toBe('Hello')
  })

  it('decodes UTF-8 characters', () => {
    expect(decodeBase64('5L2g5aW9')).toBe('你好')
  })

  it('handles empty input', () => {
    expect(decodeBase64('')).toBe('')
    expect(decodeBase64(null)).toBe('')
    expect(decodeBase64(undefined)).toBe('')
  })

  it('throws on invalid base64', () => {
    expect(() => decodeBase64('invalid!!!')).toThrow('Invalid Base64 input')
  })

  it('trims whitespace before decoding', () => {
    expect(decodeBase64('  SGVsbG8=  ')).toBe('Hello')
  })
})

describe('encodeUrl', () => {
  it('encodes URL component', () => {
    expect(encodeUrl('hello world')).toBe('hello%20world')
  })

  it('encodes full URL', () => {
    expect(encodeUrl('https://example.com/path?query=1', 'full')).toBe('https://example.com/path?query=1')
  })

  it('handles empty input', () => {
    expect(encodeUrl('')).toBe('')
  })

  it('encodes special characters', () => {
    expect(encodeUrl('a&b=c')).toBe('a%26b%3Dc')
  })
})

describe('decodeUrl', () => {
  it('decodes URL component', () => {
    expect(decodeUrl('hello%20world')).toBe('hello world')
  })

  it('decodes full URL', () => {
    expect(decodeUrl('https://example.com/path%20with%20spaces', 'full')).toBe('https://example.com/path with spaces')
  })

  it('handles empty input', () => {
    expect(decodeUrl('')).toBe('')
  })

  it('throws on invalid input', () => {
    expect(() => decodeUrl('%ZZ')).toThrow('Invalid encoded input')
  })
})

describe('countStats', () => {
  it('counts words', () => {
    expect(countStats('hello world').words).toBe(2)
  })

  it('counts characters', () => {
    expect(countStats('hello').chars).toBe(5)
  })

  it('counts characters without spaces', () => {
    expect(countStats('hello world').charsNoSpaces).toBe(10)
  })

  it('counts sentences', () => {
    expect(countStats('Hello. World! Test?').sentences).toBe(3)
  })

  it('counts paragraphs', () => {
    expect(countStats('Para 1\n\nPara 2').paragraphs).toBe(2)
  })

  it('counts lines', () => {
    expect(countStats('line1\nline2\nline3').lines).toBe(3)
  })

  it('calculates reading time', () => {
    expect(countStats('word '.repeat(200)).readingTime).toBe(1)
  })

  it('handles empty input', () => {
    const stats = countStats('')
    expect(stats.words).toBe(0)
    expect(stats.chars).toBe(0)
  })
})

describe('convertCase', () => {
  it('converts to UPPERCASE', () => {
    expect(convertCase('hello world', 'UPPERCASE')).toBe('HELLO WORLD')
  })

  it('converts to lowercase', () => {
    expect(convertCase('HELLO WORLD', 'lowercase')).toBe('hello world')
  })

  it('converts to Title Case', () => {
    expect(convertCase('hello world', 'Title Case')).toBe('Hello World')
  })

  it('converts to Sentence case', () => {
    expect(convertCase('hello world', 'Sentence case')).toBe('Hello world')
  })

  it('converts to camelCase', () => {
    expect(convertCase('hello world', 'camelCase')).toBe('helloWorld')
  })

  it('converts to PascalCase', () => {
    expect(convertCase('hello world', 'PascalCase')).toBe('HelloWorld')
  })

  it('converts to snake_case', () => {
    expect(convertCase('Hello World', 'snake_case')).toBe('hello_world')
  })

  it('converts to kebab-case', () => {
    expect(convertCase('Hello World', 'kebab-case')).toBe('hello-world')
  })

  it('converts to CONSTANT_CASE', () => {
    expect(convertCase('hello world', 'CONSTANT_CASE')).toBe('HELLO_WORLD')
  })

  it('handles empty input', () => {
    expect(convertCase('', 'UPPERCASE')).toBe('')
  })

  it('returns original for unknown format', () => {
    expect(convertCase('test', 'unknown')).toBe('test')
  })
})

describe('findDuplicates', () => {
  it('finds duplicates in comma-separated list', () => {
    const result = findDuplicates('1,2,3,4,5,5,6')
    expect(result.duplicates).toEqual(['5'])
    expect(result.counts).toEqual({ '5': 2 })
    expect(result.totalItems).toBe(7)
    expect(result.totalDuplicateItems).toBe(1)
  })

  it('returns empty when no duplicates', () => {
    const result = findDuplicates('1,2,3,4')
    expect(result.duplicates).toEqual([])
    expect(result.counts).toEqual({})
    expect(result.totalDuplicateItems).toBe(0)
  })

  it('finds duplicates in newline-separated list', () => {
    const result = findDuplicates('a\nb\nb\nc')
    expect(result.duplicates).toEqual(['b'])
    expect(result.counts).toEqual({ b: 2 })
  })

  it('handles mixed comma and newline separators', () => {
    const result = findDuplicates('x,y\nz,x')
    expect(result.duplicates).toEqual(['x'])
    expect(result.counts).toEqual({ x: 2 })
  })

  it('handles empty input', () => {
    expect(findDuplicates('').totalDuplicateItems).toBe(0)
    expect(findDuplicates(null).totalDuplicateItems).toBe(0)
    expect(findDuplicates(undefined).totalDuplicateItems).toBe(0)
  })

  it('handles whitespace-only input', () => {
    const result = findDuplicates('   ')
    expect(result.totalDuplicateItems).toBe(0)
    expect(result.totalItems).toBe(0)
  })

  it('trim option treats items with surrounding spaces as same when enabled', () => {
    const result = findDuplicates(' a, a, b', { trim: true })
    expect(result.duplicates).toEqual(['a'])
  })

  it('trim disabled treats items with spaces as different', () => {
    const result = findDuplicates(' a, a, b', { trim: false })
    expect(result.duplicates).toEqual([' a'])
  })

  it('case sensitive finds duplicates only when exact match', () => {
    const result = findDuplicates('Apple, apple, APPLE', { caseSensitive: true })
    expect(result.totalDuplicateItems).toBe(0)
  })

  it('case insensitive finds case-variant duplicates', () => {
    const result = findDuplicates('Apple, apple, APPLE', { caseSensitive: false })
    expect(result.duplicates).toEqual(['apple'])
    expect(result.counts).toEqual({ apple: 3 })
  })

  it('finds multiple distinct duplicates', () => {
    const result = findDuplicates('1,1,2,2,3')
    expect(result.duplicates).toEqual(['1', '2'])
    expect(result.counts).toEqual({ '1': 2, '2': 2 })
    expect(result.totalDuplicateItems).toBe(2)
  })

  it('reports correct count for duplicates appearing 3+ times', () => {
    const result = findDuplicates('x,x,x,y')
    expect(result.duplicates).toEqual(['x'])
    expect(result.counts).toEqual({ x: 3 })
  })
})
