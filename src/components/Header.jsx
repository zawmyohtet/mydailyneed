import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Header({ toolName, onOpenShortcuts }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MD</span>
            </div>
            <span className="font-bold text-lg">MyDailyNeed</span>
          </div>
          {toolName && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-400">{toolName}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="GitHub repository"
          >
            <span className="text-xl">GitHub</span>
          </a>
          
          <button
            onClick={onOpenShortcuts}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            <span className="text-sm font-mono">?</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon icon={theme === 'light' ? ['fas', 'moon'] : ['fas', 'sun']} />
          </button>
        </div>
      </div>
    </header>
  )
}
