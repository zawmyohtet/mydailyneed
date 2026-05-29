import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClipboard } from './useClipboard'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('useClipboard', () => {
  it('initializes with copied false', () => {
    const { result } = renderHook(() => useClipboard())
    expect(result.current.copied).toBe(false)
  })

  it('copies text successfully', async () => {
    navigator.clipboard.writeText.mockResolvedValue(undefined)
    
    const { result } = renderHook(() => useClipboard())
    
    await act(async () => {
      await result.current.copy('test text')
    })

    expect(result.current.copied).toBe(true)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text')
  })

  it('resets copied state after 2 seconds', async () => {
    navigator.clipboard.writeText.mockResolvedValue(undefined)
    vi.useFakeTimers()
    
    const { result } = renderHook(() => useClipboard())
    
    await act(async () => {
      await result.current.copy('test')
    })
    
    expect(result.current.copied).toBe(true)
    
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })
    
    expect(result.current.copied).toBe(false)
    
    vi.useRealTimers()
  })

  it('handles copy failure gracefully', async () => {
    navigator.clipboard.writeText.mockRejectedValue(new Error('Failed'))
    
    const { result } = renderHook(() => useClipboard())
    
    await act(async () => {
      const success = await result.current.copy('test')
      expect(success).toBe(false)
    })

    expect(result.current.copied).toBe(false)
  })

  it('does nothing when copying empty text', async () => {
    navigator.clipboard.writeText.mockClear()
    const { result } = renderHook(() => useClipboard())
    
    let success
    await act(async () => {
      success = await result.current.copy('')
    })

    expect(success).toBeUndefined()
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
  })
})
