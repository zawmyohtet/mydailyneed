import { useEffect, useCallback } from 'react'

export function useKeyboardShortcuts({ onOpenSearch, onRun, onCopy, onClear }) {
  const handleKeyDown = useCallback((e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const modifier = isMac ? e.metaKey : e.ctrlKey

    if (e.key === 'k' && modifier && !e.shiftKey) {
      e.preventDefault()
      onOpenSearch?.()
    }

    if (e.key === 'Enter' && modifier) {
      e.preventDefault()
      onRun?.()
    }

    if (e.key === 'c' && modifier && e.shiftKey) {
      e.preventDefault()
      onCopy?.()
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      onClear?.()
    }
  }, [onOpenSearch, onRun, onCopy, onClear])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export const SHORTCUTS = [
  { keys: 'Cmd/Ctrl + K', action: 'Open tool search', description: 'Quickly find and open any tool' },
  { keys: 'Cmd/Ctrl + Enter', action: 'Run/Process', description: 'Execute the current tool action' },
  { keys: 'Cmd/Ctrl + Shift + C', action: 'Copy output', description: 'Copy result to clipboard' },
  { keys: 'Escape', action: 'Clear/Close', description: 'Clear input or close dialogs' },
]
