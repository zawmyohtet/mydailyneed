import { useState, useMemo } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { findDuplicates } from '../../utils/textTransforms'

export default function DuplicateFinder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [caseSensitive, setCaseSensitive] = useState(true)

  const handleFind = () => {
    setError(null)
    try {
      const r = findDuplicates(input, { trim: trimWhitespace, caseSensitive })
      setResult(r)
    } catch (e) {
      setError(e.message)
      setResult(null)
    }
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError(null)
  }

  const outputText = useMemo(() => {
    if (!result) return ''
    if (result.totalDuplicateItems === 0) return 'No duplicates found'

    let output = `Total items: ${result.totalItems}\n`
    output += `Duplicate items: ${result.totalDuplicateItems}\n\n`
    output += 'Duplicates:\n'
    result.duplicates.forEach(item => {
      output += `  "${item}" - ${result.counts[item]} times\n`
    })
    return output
  }, [result])

  return (
    <ToolLayout
      title="Duplicate Finder"
      icon={["fas", "clone"]}
      description="Find duplicate items in a comma or newline separated list"
      path="/tools/duplicate-finder"
      keywords={["duplicate", "find", "list", "unique", "repeat", "distinct"]}
    >
      <div className="space-y-4">
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            Trim whitespace
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            Case sensitive
          </label>
        </div>

        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter your list
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4, 5, 5, 6"
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFind}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Find Duplicates
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm font-medium">Error</p>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Result
          </label>
          <div className="relative">
            <textarea
              id="output"
              value={outputText}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm resize-none text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <CopyButton text={outputText} />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
