import { describe, it, expect } from 'vitest'
import { formatXml, minifyXml, validateXml } from './formatXml'

describe('formatXml', () => {
  it('formats valid XML with 2-space indent', () => {
    const { formatted, error } = formatXml('<root><child>text</child></root>', 2)
    expect(error).toBeNull()
    expect(formatted).toContain('  <child>')
  })

  it('formats valid XML with 4-space indent', () => {
    const { formatted, error } = formatXml('<root><child>text</child></root>', 4)
    expect(error).toBeNull()
    expect(formatted).toContain('    <child>')
  })

  it('returns error for invalid XML', () => {
    const { formatted, error } = formatXml('<root><unclosed>')
    expect(formatted).toBeNull()
    expect(error).toBeDefined()
  })

  it('handles empty input', () => {
    const { formatted, error } = formatXml('')
    expect(formatted).toBe('')
    expect(error).toBeNull()
  })

  it('handles whitespace-only input', () => {
    const { formatted, error } = formatXml('   \n  ')
    expect(formatted).toBe('')
    expect(error).toBeNull()
  })

  it('handles XML with attributes', () => {
    const { formatted, error } = formatXml('<root attr="value"/>')
    expect(error).toBeNull()
    expect(formatted).toContain('attr="value"')
  })

  it('strips DOCTYPE to prevent XXE attacks', () => {
    const malicious = '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>'
    const result = formatXml(malicious)
    expect(result.error).toBeDefined()
    expect(result.formatted).toBeNull()
    expect(result.error).not.toContain('file:///etc/passwd')
  })

  it('strips ENTITY declarations', () => {
    const malicious = '<!DOCTYPE foo [<!ENTITY xxe "test">]><root>&xxe;</root>'
    const result = formatXml(malicious)
    expect(result.error).toBeDefined()
    expect(result.formatted).toBeNull()
  })

  it('rejects oversized input', () => {
    const large = '<root>' + 'a'.repeat(1024 * 1024) + '</root>'
    const { formatted, error } = formatXml(large)
    expect(formatted).toBeNull()
    expect(error).toContain('too large')
  })
})

describe('minifyXml', () => {
  it('minifies valid XML', () => {
    const input = '<root>\n  <child>text</child>\n</root>'
    const { minified, error } = minifyXml(input)
    expect(error).toBeNull()
    expect(minified).toBe('<root><child>text</child></root>')
  })

  it('strips comments by default', () => {
    const input = '<root><!-- comment --></root>'
    const { minified, error } = minifyXml(input)
    expect(error).toBeNull()
    expect(minified).toBe('<root></root>')
  })

  it('preserves comments when enabled', () => {
    const input = '<root><!-- comment --></root>'
    const { minified, error } = minifyXml(input, true)
    expect(error).toBeNull()
    expect(minified).toContain('<!-- comment -->')
  })

  it('returns error for invalid XML', () => {
    const { minified, error } = minifyXml('<root><unclosed>')
    expect(minified).toBeNull()
    expect(error).toBeDefined()
  })

  it('handles empty input', () => {
    const { minified, error } = minifyXml('')
    expect(minified).toBe('')
    expect(error).toBeNull()
  })

  it('handles self-closing tags', () => {
    const { minified, error } = minifyXml('<root><img/></root>')
    expect(error).toBeNull()
    expect(minified).toBe('<root><img/></root>')
  })
})

describe('validateXml', () => {
  it('returns valid:true for valid XML', () => {
    const { valid, error } = validateXml('<root/>')
    expect(valid).toBe(true)
    expect(error).toBeNull()
  })

  it('returns valid:false for invalid XML', () => {
    const { valid, error } = validateXml('<root><unclosed>')
    expect(valid).toBe(false)
    expect(error).toBeDefined()
  })

  it('handles empty input', () => {
    const { valid, error } = validateXml('')
    expect(valid).toBe(false)
    expect(error).toBeDefined()
  })

  it('handles XML with declaration', () => {
    const { valid, error } = validateXml('<?xml version="1.0"?><root/>')
    expect(valid).toBe(true)
    expect(error).toBeNull()
  })

  it('handles XML with attributes', () => {
    const { valid, error } = validateXml('<root attr="value"/>')
    expect(valid).toBe(true)
    expect(error).toBeNull()
  })
})
