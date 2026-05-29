import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ToolSearch from './components/ToolSearch'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal'
import SEO from './components/SEO'
import { tools } from './tools/registry'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

const toolComponents = {}
tools.forEach(tool => {
  toolComponents[tool.id] = lazy(tool.component)
})

function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <SEO
        path="/"
        keywords="developer tools, json formatter, xml minifier, base64 encoder, word counter, uuid generator, free online tools"
      />
      <h1 className="text-4xl font-bold mb-4">Welcome to MyDailyNeed</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        A collection of lightweight, privacy-first developer utility tools that run entirely in your browser.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        {tools.map(tool => (
          <a
            key={tool.id}
            href={`#${tool.path}`}
            className="p-4 border rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
          >
            <h3 className="font-medium mb-1">{tool.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  )
}

function App() {
  const [theme] = useLocalStorage('theme', 'light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const navigate = useNavigate()

  useKeyboardShortcuts({
    onOpenSearch: () => setSearchOpen(true),
    onRun: () => {
      const runButton = document.querySelector('[data-action="run"]')
      runButton?.click()
    },
    onCopy: () => {
      const copyButton = document.querySelector('[data-action="copy"]')
      copyButton?.click()
    },
    onClear: () => {
      const clearButton = document.querySelector('[data-action="clear"]')
      clearButton?.click()
      if (searchOpen) setSearchOpen(false)
      if (shortcutsOpen) setShortcutsOpen(false)
    }
  })

  const handleToolSelect = (tool) => {
    navigate(`/tools/${tool.id}`)
  }

  return (
    <div className={theme}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="lg:hidden">
            <Header toolName="" onOpenShortcuts={() => setShortcutsOpen(true)} />
          </div>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                aria-label="Open menu"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
            
            <Routes>
              <Route path="/" element={<Home />} />
              {tools.map(tool => {
                const ToolComponent = toolComponents[tool.id]
                return (
                  <Route
                    key={tool.id}
                    path={`/tools/${tool.id}`}
                    element={
                      <Suspense fallback={<Loading />}>
                        <ToolComponent />
                      </Suspense>
                    }
                  />
                )
              })}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      
      <ToolSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleToolSelect}
        tools={tools}
      />
      
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  )
}

export default App
