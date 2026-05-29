import { describe, it, expect } from 'vitest'
import { validateFile, validateImageFile } from './fileValidation'

function createMockFile(name, size, type) {
  const file = new File(['x'.repeat(size)], name, { type })
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  })
  return file
}

describe('validateFile', () => {
  it('accepts valid file within size limit', () => {
    const file = createMockFile('test.png', 1024 * 1024, 'image/png')
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('rejects file exceeding max size', () => {
    const file = createMockFile('test.png', 6 * 1024 * 1024, 'image/png')
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('5.0MB')
  })

  it('rejects unsupported format', () => {
    const file = createMockFile('test.pdf', 1024, 'application/pdf')
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Unsupported')
  })

  it('accepts PNG format', () => {
    const file = createMockFile('test.png', 1024, 'image/png')
    expect(validateFile(file).valid).toBe(true)
  })

  it('accepts JPEG format', () => {
    const file = createMockFile('test.jpg', 1024, 'image/jpeg')
    expect(validateFile(file).valid).toBe(true)
  })

  it('accepts WEBP format', () => {
    const file = createMockFile('test.webp', 1024, 'image/webp')
    expect(validateFile(file).valid).toBe(true)
  })

  it('accepts BMP format', () => {
    const file = createMockFile('test.bmp', 1024, 'image/bmp')
    expect(validateFile(file).valid).toBe(true)
  })

  it('accepts GIF format', () => {
    const file = createMockFile('test.gif', 1024, 'image/gif')
    expect(validateFile(file).valid).toBe(true)
  })

  it('handles custom max size', () => {
    const file = createMockFile('test.png', 2000, 'image/png')
    const result = validateFile(file, { maxSize: 1000 })
    expect(result.valid).toBe(false)
  })
})

describe('validateImageFile', () => {
  it('accepts valid image file', () => {
    const file = createMockFile('test.png', 1024, 'image/png')
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
  })

  it('rejects large image files', () => {
    const file = createMockFile('test.png', 6 * 1024 * 1024, 'image/png')
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
  })

  it('rejects non-image formats', () => {
    const file = createMockFile('test.txt', 1024, 'text/plain')
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
  })
})
