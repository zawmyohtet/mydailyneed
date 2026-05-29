import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

function mockLocalStorage() {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
    get length() { return Object.keys(store).length },
    key: vi.fn((index) => Object.keys(store)[index] ?? null),
  }
}

describe('useLocalStorage', () => {
  beforeEach(() => {
    const ls = mockLocalStorage()
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(ls)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns initial value when no stored value', () => {
    window.localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
    expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('sets value in localStorage', () => {
    window.localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
  })

  it('updates state when value is set', () => {
    window.localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
  })

  it('handles functional updates', () => {
    window.localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('count', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('handles JSON objects', () => {
    window.localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('obj', { a: 1 }))
    
    act(() => {
      result.current[1]({ a: 2, b: 3 })
    })

    expect(result.current[0]).toEqual({ a: 2, b: 3 })
  })

  it('handles storage events', () => {
    window.localStorage.getItem
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify('updated-value'))
    const { result } = renderHook(() => useLocalStorage('shared-key', 'default'))
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'shared-key',
      newValue: JSON.stringify('updated-value'),
    }))

    expect(window.localStorage.getItem).toHaveBeenCalled()
  })
})
