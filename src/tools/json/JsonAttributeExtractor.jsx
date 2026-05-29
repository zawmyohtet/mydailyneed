import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { extractJsonPath } from '../../utils/jsonPathExtractor'

const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "roles": ["admin", "editor"],
    "address": {
      "city": "Singapore",
      "zip": "018956"
    }
  },
  {
    "id": 2,
    "name": "Bob",
    "email": "bob@example.com",
    "roles": ["viewer"],
    "address": {
      "city": "Tokyo",
      "zip": "100-0001"
    }
  }
]`

const EXAMPLE_PATHS = [
  { path: '$[*].name', description: 'All names' },
  { path: '$[*].id', description: 'All IDs' },
  { path: '$[*].address.city', description: 'All cities (nested)' },
  { path: '$[0]', description: 'First item' },
  { path: '$..email', description: 'All emails (recursive)' },
]

export default function JsonAttributeExtractor() {
  const [input, setInput] = useState('')
  const [path, setPath] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const runExtraction = useCallback((json, jsonPath) => {
    if (!json.trim() || !jsonPath.trim()) {
      setOutput('')
      setError(null)
      return
    }

    const { result, error: extractError } = extractJsonPath(json, jsonPath)
    if (extractError) {
      setError(extractError)
      setOutput('')
    } else {
      setError(null)
      setOutput(JSON.stringify(result, null, 2))
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      runExtraction(input, path)
    }, 150)
    return () => clearTimeout(debounceRef.current)
  }, [input, path, runExtraction])

  const handleClear = () => {
    setInput('')
    setPath('')
    setOutput('')
    setError(null)
  }

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON)
    setPath('$[*].name')
  }

  return (
    <ToolLayout
      title="JSON Attribute Extractor"
      icon={['fas', 'filter']}
      description="Extract specific attributes from JSON using JSONPath expressions"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleLoadSample}
            className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Load Sample
          </button>

          <div className="flex-1" />

          <button
            onClick={handleClear}
            data-action="clear"
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Clear
          </button>
        </div>

        <div>
          <label htmlFor="path" className="block text-sm font-medium mb-2">
            JSONPath Expression
          </label>
          <input
            id="path"
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="e.g., $[*].name or $[0].address.city"
            className="w-full px-4 py-3 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLE_PATHS.map((example) => (
              <button
                key={example.path}
                onClick={() => setPath(example.path)}
                className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title={example.description}
              >
                {example.path}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="input" className="block text-sm font-medium mb-2">
              Input JSON
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Extracted Result</label>
              {output && <CopyButton text={output} label="Copy result" />}
            </div>
            <textarea
              readOnly
              value={output}
              placeholder="Extracted attributes will appear here..."
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
