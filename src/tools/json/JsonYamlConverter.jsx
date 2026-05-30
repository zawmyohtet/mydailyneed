import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import jsYaml from 'js-yaml'
import { formatJson } from '../../utils/formatJson'
import CopyButton from '../../components/CopyButton'
import SEO from '../../components/SEO'

export default function JsonYamlConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [direction, setDirection] = useState('json-to-yaml')

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }

    try {
      if (direction === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        const yaml = jsYaml.dump(parsed, { indent: 2 })
        setOutput(yaml)
        setError(null)
      } else {
        const parsed = jsYaml.load(input)
        const { formatted } = formatJson(JSON.stringify(parsed), 2)
        setOutput(formatted)
        setError(null)
      }
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

  return (
    <div className="space-y-4">
      <SEO
        title="JSON ↔ YAML Converter"
        description="Convert between JSON and YAML formats"
        path="/tools/json-yaml"
        keywords={['json', 'yaml', 'convert', 'transform']}
      />
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={['fas', 'exchange-alt']} className="text-2xl text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">JSON ↔ YAML Converter</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setDirection('json-to-yaml'); setOutput(''); setError(null) }}
            className={`px-4 py-2 rounded-lg ${direction === 'json-to-yaml' ? 'bg-primary-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            JSON → YAML
          </button>
          <button
            onClick={() => { setDirection('yaml-to-json'); setOutput(''); setError(null) }}
            className={`px-4 py-2 rounded-lg ${direction === 'yaml-to-json' ? 'bg-primary-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            YAML → JSON
          </button>
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
          onClick={handleConvert}
          data-action="run"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Convert
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Input ({direction === 'json-to-yaml' ? 'JSON' : 'YAML'})
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={direction === 'json-to-yaml' ? 'Paste JSON here' : 'Paste YAML here'}
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Output ({direction === 'json-to-yaml' ? 'YAML' : 'JSON'})
            </label>
            {output && <CopyButton text={output} label="Copy output" />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Converted output will appear here"
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )
}
