import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatJson } from '../../utils/formatJson'
import CopyButton from '../../components/CopyButton'
import SEO from '../../components/SEO'

const INDENT_OPTIONS = [
  { value: 2, label: '2 spaces' },
  { value: 4, label: '4 spaces' },
  { value: '\t', label: 'Tab' },
]

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [indent, setIndent] = useState(2)
  const [autoFormat, setAutoFormat] = useState(false)

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    setError(null)

    if (autoFormat && value.trim()) {
      const result = formatJson(value, indent)
      if (result.error) {
        setError(result.error)
        setOutput('')
      } else {
        setOutput(result.formatted)
      }
    } else {
      setOutput('')
    }
  }

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }

    const result = formatJson(input, indent)
    if (result.error) {
      setError(result.error)
      setOutput('')
    } else {
      setError(null)
      setOutput(result.formatted)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  return (
    <div className="space-y-4">
      <SEO
        title="JSON Formatter"
        description="Prettify and validate JSON with syntax highlighting"
        path="/tools/json-formatter"
        keywords={['json', 'format', 'prettify', 'beautify', 'validate']}
      />
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={['fas', 'code']} className="text-2xl text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">JSON Formatter</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="indent" className="text-sm font-medium text-gray-700 dark:text-gray-300">Indent:</label>
          <select
            id="indent"
            value={indent}
            onChange={(e) => setIndent(e.target.value === 'tab' ? '\t' : Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {INDENT_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={autoFormat}
            onChange={(e) => setAutoFormat(e.target.checked)}
            className="rounded"
          />
          Auto-format on paste
        </label>

        <div className="flex-1" />

        <button
          onClick={handleClear}
          data-action="clear"
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          Clear
        </button>
        <button
          onClick={handleFormat}
          data-action="run"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Format
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Input</label>
          <textarea
            id="input"
            value={input}
            onChange={handleInputChange}
            placeholder='Paste your JSON here, e.g., {"name": "value"}'
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            {output && <CopyButton text={output} label="Copy formatted JSON" />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted JSON will appear here"
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )
}
