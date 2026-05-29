import { describe, it, expect } from 'vitest'
import { validateImageFile } from './ocr'

describe('validateImageFile', () => {
  it('accepts valid JPEG file', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('accepts valid PNG file', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('accepts valid GIF file', () => {
    const file = new File(['test'], 'test.gif', { type: 'image/gif' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('accepts valid WebP file', () => {
    const file = new File(['test'], 'test.webp', { type: 'image/webp' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('rejects unsupported format', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Unsupported format')
  })

  it('rejects text file', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Unsupported format')
  })

  it('rejects file too large', () => {
    const file = new File([new ArrayBuffer(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too large')
  })

  it('rejects null file', () => {
    const result = validateImageFile(null)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('No file selected')
  })

  it('rejects undefined file', () => {
    const result = validateImageFile(undefined)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('No file selected')
  })

  it('accepts file at max size', () => {
    const file = new File([new ArrayBuffer(5 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' })
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
  })
})
