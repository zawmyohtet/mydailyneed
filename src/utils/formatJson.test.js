import { describe, it, expect } from 'vitest'
import { formatJson, minifyJson, validateJson } from './formatJson'

describe('formatJson', () => {
  it('formats valid JSON with 2-space indent', () => {
    const { formatted, error } = formatJson('{"a":1}', 2)
    expect(error).toBeNull()
    expect(formatted).toContain('  "a": 1')
  })

  it('formats valid JSON with 4-space indent', () => {
    const { formatted, error } = formatJson('{"a":1}', 4)
    expect(error).toBeNull()
    expect(formatted).toContain('    "a": 1')
  })

  it('formats valid JSON with tab indent', () => {
    const { formatted, error } = formatJson('{"a":1}', '\t')
    expect(error).toBeNull()
    expect(formatted).toContain('\t"a": 1')
  })

  it('returns error for invalid JSON', () => {
    const { formatted, error } = formatJson('{invalid}')
    expect(formatted).toBeNull()
    expect(error).toBeDefined()
  })

  it('handles empty input', () => {
    const { formatted, error } = formatJson('')
    expect(formatted).toBe('')
    expect(error).toBeNull()
  })

  it('handles whitespace-only input', () => {
    const { formatted, error } = formatJson('   \n  ')
    expect(formatted).toBe('')
    expect(error).toBeNull()
  })

  it('handles empty object', () => {
    const { formatted, error } = formatJson('{}')
    expect(error).toBeNull()
    expect(formatted).toBe('{}')
  })

  it('handles empty array', () => {
    const { formatted, error } = formatJson('[]')
    expect(error).toBeNull()
    expect(formatted).toBe('[]')
  })

  it('handles nested objects', () => {
    const { formatted, error } = formatJson('{"a":{"b":1}}')
    expect(error).toBeNull()
    expect(formatted).toContain('"a"')
    expect(formatted).toContain('"b"')
  })
})

describe('minifyJson', () => {
  it('minifies valid JSON', () => {
    const { minified, error } = minifyJson('{ "a": 1 }')
    expect(error).toBeNull()
    expect(minified).toBe('{"a":1}')
  })

  it('minifies complex JSON', () => {
    const input = '{\n  "name": "test",\n  "value": 123\n}'
    const { minified, error } = minifyJson(input)
    expect(error).toBeNull()
    expect(minified).toBe('{"name":"test","value":123}')
  })

  it('returns error for invalid JSON', () => {
    const { minified, error } = minifyJson('{invalid}')
    expect(minified).toBeNull()
    expect(error).toBeDefined()
  })

  it('handles empty input', () => {
    const { minified, error } = minifyJson('')
    expect(minified).toBe('')
    expect(error).toBeNull()
  })

  it('handles empty object', () => {
    const { minified, error } = minifyJson('{}')
    expect(error).toBeNull()
    expect(minified).toBe('{}')
  })
})

describe('validateJson', () => {
  it('returns valid:true for valid JSON', () => {
    const { valid, error } = validateJson('{"a":1}')
    expect(valid).toBe(true)
    expect(error).toBeNull()
  })

  it('returns valid:false for invalid JSON', () => {
    const { valid, error } = validateJson('{invalid}')
    expect(valid).toBe(false)
    expect(error).toBeDefined()
  })

  it('handles empty input', () => {
    const { valid, error } = validateJson('')
    expect(valid).toBe(false)
    expect(error).toBeDefined()
  })

  it('handles empty object', () => {
    const { valid, error } = validateJson('{}')
    expect(valid).toBe(true)
    expect(error).toBeNull()
  })

  it('handles arrays', () => {
    const { valid, error } = validateJson('[1,2,3]')
    expect(valid).toBe(true)
    expect(error).toBeNull()
  })
})
