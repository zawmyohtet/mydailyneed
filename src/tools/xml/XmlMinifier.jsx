import { useState } from 'react'
import { minifyXml } from '../../utils/formatXml'
import CopyButton from '../../components/CopyButton'
import SEO from '../../components/SEO'

export default function XmlMinifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [preserveComments, setPreserveComments] = useState(false)
  const [stats, setStats] = useState(null)

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      setStats(null)
      return
    }

    const result = minifyXml(input, preserveComments)
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
        title="XML Minifier"
        description="Strip whitespace from XML for compact output"
        path="/tools/xml-minifier"
        keywords={['xml', 'minify', 'compress', 'compact']}
      />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={preserveComments}
            onChange={(e) => setPreserveComments(e.target.checked)}
            className="rounded"
          />
          Preserve comments
        </label>

        <div className="flex-1" />

        {stats && (
          <div className="flex items-center gap-4 text-sm">
            <span>Original: <strong>{stats.original.toLocaleString()}</strong> bytes</span>
            <span>Minified: <strong>{stats.minified.toLocaleString()}</strong> bytes</span>
            <span className="text-green-600 dark:text-green-400">
              Saved: <strong>{stats.savings}%</strong>
            </span>
          </div>
        )}

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
            placeholder='Paste your XML here, e.g., <root><child>text</child></root>'
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Output</label>
            {output && <CopyButton text={output} label="Copy minified XML" />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Minified XML will appear here"
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  )
}
