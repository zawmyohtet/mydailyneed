import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it('returns initial value when no stored value', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
    getItemSpy.mockRestore()
  })

  it('sets value in localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(setItemSpy).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
    setItemSpy.mockRestore()
    getItemSpy.mockRestore()
  })

  it('updates state when value is set', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    getItemSpy.mockRestore()
  })

  it('handles functional updates', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('count', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    getItemSpy.mockRestore()
  })

  it('handles JSON objects', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const { result } = renderHook(() => useLocalStorage('obj', { a: 1 }))
    
    act(() => {
      result.current[1]({ a: 2, b: 3 })
    })

    expect(result.current[0]).toEqual({ a: 2, b: 3 })
    getItemSpy.mockRestore()
  })

  it('handles storage events', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(JSON.stringify('updated-value'))
    const { result } = renderHook(() => useLocalStorage('shared-key', 'default'))
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'shared-key',
      newValue: JSON.stringify('updated-value'),
    }))

    expect(getItemSpy).toHaveBeenCalled()
    getItemSpy.mockRestore()
  })
})
