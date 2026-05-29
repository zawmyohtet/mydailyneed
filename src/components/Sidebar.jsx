import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { tools } from '../tools/registry'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const [search, setSearch] = useState('')

  const filteredTools = useMemo(() => {
    if (!search.trim()) return tools
    
    const query = search.toLowerCase()
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some(k => k.toLowerCase().includes(query))
    )
  }, [search])

  const groupedTools = useMemo(() => {
    const groups = {}
    filteredTools.forEach(tool => {
      if (!groups[tool.category]) {
        groups[tool.category] = []
      }
      groups[tool.category].push(tool)
    })
    return groups
  }, [filteredTools])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700
        transform transition-transform lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Search */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
              <FontAwesomeIcon 
                icon={['fas', 'search']} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Cmd+K</kbd> to focus
            </p>
          </div>

          {/* Tool list */}
          <nav className="flex-1 overflow-auto p-4">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {categoryTools.map(tool => {
                    const isActive = location.pathname === tool.path
                    return (
                      <li key={tool.id}>
                        <Link
                          to={tool.path}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                            ${isActive 
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <FontAwesomeIcon icon={tool.icon} className="w-5 h-5" />
                          <span className="text-sm">{tool.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
