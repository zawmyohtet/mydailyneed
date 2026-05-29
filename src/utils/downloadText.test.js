import { describe, it, expect, vi } from 'vitest'
import { downloadText } from './downloadText'

describe('downloadText', () => {
  it('creates blob with correct content', () => {
    const BlobMock = vi.fn().mockImplementation(() => ({ type: 'text/plain' }))
    const originalBlob = window.Blob
    window.Blob = BlobMock

    downloadText('test content', 'test.txt')

    expect(BlobMock).toHaveBeenCalledWith(['test content'], { type: 'text/plain' })
    window.Blob = originalBlob
  })

  it('creates and clicks anchor element', () => {
    const clickSpy = vi.fn()
    const createSpy = vi.spyOn(document, 'createElement').mockImplementation(() => ({
      href: '',
      download: 'test.txt',
      click: clickSpy,
    }))
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url')

    downloadText('content', 'test.txt')

    expect(createSpy).toHaveBeenCalledWith('a')
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeSpy).toHaveBeenCalled()

    createSpy.mockRestore()
    appendSpy.mockRestore()
    removeSpy.mockRestore()
    revokeSpy.mockRestore()
  })

  it('uses default filename', () => {
    const createSpy = vi.spyOn(document, 'createElement').mockImplementation(() => ({
      href: '',
      download: '',
      click: vi.fn(),
    }))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url')
    vi.spyOn(URL, 'revokeObjectURL')
    vi.spyOn(document.body, 'appendChild')
    vi.spyOn(document.body, 'removeChild')

    downloadText('content')

    expect(createSpy().download).toBe('')

    createSpy.mockRestore()
  })
})
