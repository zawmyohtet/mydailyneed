import { describe, it, expect } from 'vitest'
import { extractJsonPath } from './jsonPathExtractor'

describe('extractJsonPath', () => {
  const sampleJson = JSON.stringify([
    { id: 1, name: 'Alice', email: 'alice@example.com', address: { city: 'Singapore' } },
    { id: 2, name: 'Bob', email: 'bob@example.com', address: { city: 'Tokyo' } },
  ])

  it('returns error for empty input', () => {
    const result = extractJsonPath('', '$')
    expect(result.error).toBe('No input provided')
    expect(result.result).toBeNull()
  })

  it('returns error for whitespace-only input', () => {
    const result = extractJsonPath('   ', '$')
    expect(result.error).toBe('No input provided')
  })

  it('returns error for empty path', () => {
    const result = extractJsonPath(sampleJson, '')
    expect(result.error).toBe('No path expression provided')
    expect(result.result).toBeNull()
  })

  it('returns error for whitespace-only path', () => {
    const result = extractJsonPath(sampleJson, '   ')
    expect(result.error).toBe('No path expression provided')
  })

  it('returns error for invalid JSON', () => {
    const result = extractJsonPath('{invalid}', '$')
    expect(result.error).toBeDefined()
    expect(result.result).toBeNull()
  })

  it('returns error for path not starting with $', () => {
    const result = extractJsonPath(sampleJson, '[invalid')
    expect(result.error).toBe('Path must start with $')
    expect(result.result).toBeNull()
  })

  it('returns error for unmatched ] bracket', () => {
    const result = extractJsonPath(sampleJson, '$]test')
    expect(result.error).toBe('Unmatched ] bracket')
    expect(result.result).toBeNull()
  })

  it('returns error for unmatched [ bracket', () => {
    const result = extractJsonPath(sampleJson, '$[test')
    expect(result.error).toBe('Unmatched [ bracket')
    expect(result.result).toBeNull()
  })

  it('extracts root with $', () => {
    const result = extractJsonPath(sampleJson, '$')
    expect(result.error).toBeNull()
    expect(result.result).toEqual(JSON.parse(sampleJson))
  })

  it('extracts all array elements with $[*]', () => {
    const result = extractJsonPath(sampleJson, '$[*]')
    expect(result.error).toBeNull()
    expect(result.result).toHaveLength(2)
  })

  it('extracts all name fields with $[*].name', () => {
    const result = extractJsonPath(sampleJson, '$[*].name')
    expect(result.error).toBeNull()
    expect(result.result).toEqual(['Alice', 'Bob'])
  })

  it('extracts all id fields with $[*].id', () => {
    const result = extractJsonPath(sampleJson, '$[*].id')
    expect(result.error).toBeNull()
    expect(result.result).toEqual([1, 2])
  })

  it('extracts first element with $[0]', () => {
    const result = extractJsonPath(sampleJson, '$[0]')
    expect(result.error).toBeNull()
    expect(result.result).toEqual(JSON.parse(sampleJson)[0])
  })

  it('extracts nested value with $[0].address.city', () => {
    const result = extractJsonPath(sampleJson, '$[0].address.city')
    expect(result.error).toBeNull()
    expect(result.result).toBe('Singapore')
  })

  it('extracts all nested cities with $[*].address.city', () => {
    const result = extractJsonPath(sampleJson, '$[*].address.city')
    expect(result.error).toBeNull()
    expect(result.result).toEqual(['Singapore', 'Tokyo'])
  })

  it('extracts all emails recursively with $..email', () => {
    const result = extractJsonPath(sampleJson, '$..email')
    expect(result.error).toBeNull()
    expect(result.result).toEqual(['alice@example.com', 'bob@example.com'])
  })

  it('extracts from deeply nested object', () => {
    const nestedJson = JSON.stringify({
      data: { items: [{ id: 1, name: 'test' }] },
    })
    const result = extractJsonPath(nestedJson, '$.data.items[0].name')
    expect(result.error).toBeNull()
    expect(result.result).toBe('test')
  })

  it('handles empty array', () => {
    const result = extractJsonPath('[]', '$')
    expect(result.error).toBeNull()
    expect(result.result).toEqual([])
  })

  it('handles empty object', () => {
    const result = extractJsonPath('{}', '$')
    expect(result.error).toBeNull()
    expect(result.result).toEqual({})
  })

  it('returns undefined for non-existent path', () => {
    const result = extractJsonPath(sampleJson, '$[*].nonExistent')
    expect(result.error).toBeNull()
    expect(result.result).toBeUndefined()
  })

  it('rejects input exceeding 5MB limit', () => {
    const largeArray = Array(500000).fill({ id: 1, data: 'x'.repeat(10) })
    const largeJson = JSON.stringify(largeArray)
    const result = extractJsonPath(largeJson, '$')
    expect(result.error).toContain('too large')
    expect(result.result).toBeNull()
  })
})
