import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function fuzzyMatch(query, text) {
  if (!query) return true
  const lowerQuery = query.toLowerCase()
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes(lowerQuery)) return true
  
  let queryIndex = 0
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++
    }
  }
  return queryIndex === lowerQuery.length
}

export default function ToolSearch({ tools, isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('')

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools
    return tools.filter(tool => 
      fuzzyMatch(query, tool.name) ||
      fuzzyMatch(query, tool.description) ||
      tool.keywords?.some(keyword => fuzzyMatch(query, keyword))
    )
  }, [query, tools])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={['fas', 'search']} className="text-gray-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              className="flex-1 bg-transparent outline-none text-lg"
              aria-label="Search tools"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={['fas', 'times']} />
              </button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-auto">
          {filteredTools.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={['fas', 'search']} className="text-3xl mb-2 opacity-50" />
              <p>No tools found for "{query}"</p>
            </div>
          ) : (
            filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelect(tool)
                  setQuery('')
                  onClose()
                }}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FontAwesomeIcon icon={tool.icon} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{tool.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 flex justify-between">
          <span>{filteredTools.length} of {tools.length} tools</span>
          <span>↑↓ to navigate · Enter to select · Esc to close</span>
        </div>
      </div>
    </div>
  )
}
