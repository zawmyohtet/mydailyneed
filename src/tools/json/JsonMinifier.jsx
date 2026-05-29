import { useState } from 'react'
import { minifyJson } from '../../utils/formatJson'
import CopyButton from '../../components/CopyButton'
import SEO from '../../components/SEO'

export default function JsonMinifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      setStats(null)
      return
    }

    const result = minifyJson(input)
    if (result.error) {
      setError(result.error)
      setOutput('')
      setStats(null)
    } else {
      setError(null)
      setOutput(result.minified)
      
      const originalSize = new Blob([input]).size
      const minifiedSize = new Blob([result.minified]).size
      const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1)
      
      setStats({
        original: originalSize,
        minified: minifiedSize,
        savings,
      })
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
    setStats(null)
  }

  return (
    <div className="space-y-4">
      <SEO
        title="JSON Minifier"
        description="Remove whitespace from JSON for compact output"
        path="/tools/json-minifier"
        keywords={['json', 'minify', 'compress', 'compact']}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {stats && (
            <div className="flex items-center gap-4 text-sm">
              <span>Original: <strong>{stats.original.toLocaleString()}</strong> bytes</span>
              <span>Minified: <strong>{stats.minified.toLocaleString()}</strong> bytes</span>
              <span className="text-green-600 dark:text-green-400">
                Saved: <strong>{stats.savings}%</strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Clear
          </button>
          <button
            onClick={handleMinify}
            data-action="run"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Minify
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium mb-2">Input</label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here, e.g., { "name": "value" }'
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Output</label>
            {output && <CopyButton text={output} label="Copy minified JSON" />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Minified JSON will appear here"
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  )
}
