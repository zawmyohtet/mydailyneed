import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatXml } from '../../utils/formatXml'
import CopyButton from '../../components/CopyButton'
import SEO from '../../components/SEO'

const INDENT_OPTIONS = [
  { value: 2, label: '2 spaces' },
  { value: 4, label: '4 spaces' },
]

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [indent, setIndent] = useState(2)

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }

    const result = formatXml(input, indent)
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
        title="XML Formatter"
        description="Prettify and validate XML with proper indentation"
        path="/tools/xml-formatter"
        keywords={['xml', 'format', 'prettify', 'beautify', 'validate']}
      />
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={['fas', 'code']} className="text-2xl text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">XML Formatter</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="indent" className="text-sm font-medium text-gray-700 dark:text-gray-300">Indent:</label>
          <select
            id="indent"
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {INDENT_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

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
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your XML here, e.g., <root><child>text</child></root>'
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            {output && <CopyButton text={output} label="Copy formatted XML" />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted XML will appear here"
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )
}
