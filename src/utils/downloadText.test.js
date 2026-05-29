import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadText } from './downloadText'

const originalCreateElement = document.createElement.bind(document)

describe('downloadText', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url')
    vi.spyOn(URL, 'revokeObjectURL')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates blob with correct content', () => {
    const blobSpy = vi.spyOn(window, 'Blob')

    downloadText('test content', 'test.txt')

    expect(blobSpy).toHaveBeenCalledWith(['test content'], { type: 'text/plain' })
  })

  it('creates and clicks anchor element', () => {
    const clickSpy = vi.fn()
    const createSpy = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag)
      el.download = 'test.txt'
      el.click = clickSpy
      return el
    })

    downloadText('content', 'test.txt')

    expect(createSpy).toHaveBeenCalledWith('a')
    expect(clickSpy).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('uses default filename', () => {
    const createSpy = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag)
      el.click = vi.fn()
      return el
    })

    downloadText('content')

    expect(createSpy).toHaveBeenCalledWith('a')
    expect(createSpy.mock.results[0].value.download).toBe('extracted-text.txt')
  })
})
