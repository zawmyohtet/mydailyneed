import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts'

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 id="shortcuts-title" className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={['fas', 'times']} />
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          {SHORTCUTS.map((shortcut, index) => (
            <div key={index} className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                {shortcut.keys}
              </kbd>
              <div className="flex-1">
                <p className="font-medium text-sm">{shortcut.action}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{shortcut.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">?</kbd> anytime to open this help
          </p>
        </div>
      </div>
    </div>
  )
}
