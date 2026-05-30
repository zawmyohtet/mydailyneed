import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { formatTimestamp, parseTimestamp } from '../../utils/misc'

const FORMAT_OPTIONS = [
  { value: 'ISO', label: 'ISO 8601' },
  { value: 'UTC', label: 'UTC String' },
  { value: 'locale', label: 'Locale String' },
  { value: 'timestamp', label: 'Unix Timestamp' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
]

export default function TimestampConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('ISO')
  const [error, setError] = useState(null)

  const handleConvert = () => {
    setError(null)
    try {
      const parsed = parseTimestamp(input)
      if (!parsed) {
        setError('Invalid timestamp or date format')
        setOutput('')
        return
      }
      const formatted = formatTimestamp(parsed, selectedFormat)
      setOutput(formatted)
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  const handleNow = () => {
    const now = Date.now().toString()
    setInput(now)
    setError(null)
  }

  return (
    <ToolLayout
      title="Timestamp Converter"
      icon={["fas", "clock"]}
      description="Convert between Unix timestamps and human-readable dates"
      path="/tools/timestamp-converter"
      keywords={["timestamp", "date", "time", "unix", "convert"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Input (timestamp or date)
          </label>
          <div className="flex gap-2">
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 1609459200000 or 2021-01-01T00:00:00Z"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <button
              onClick={handleNow}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium text-sm"
            >
              Now
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Output format
          </label>
          <select
            id="format"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {FORMAT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Convert
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

        {output && (
          <div>
            <label htmlFor="output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Converted
            </label>
            <div className="relative">
              <input
                id="output"
                type="text"
                value={output}
                readOnly
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-gray-900 dark:text-gray-100"
              />
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
