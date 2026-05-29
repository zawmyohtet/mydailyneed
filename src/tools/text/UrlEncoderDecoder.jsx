import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { encodeUrl, decodeUrl } from '../../utils/textTransforms'

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode')
  const [urlMode, setUrlMode] = useState('component')
  const [error, setError] = useState(null)

  const handleProcess = () => {
    setError(null)
    try {
      const result = mode === 'encode' 
        ? encodeUrl(input, urlMode) 
        : decodeUrl(input, urlMode)
      setOutput(result)
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
    <ToolLayout
      title="URL Encoder/Decoder"
      icon={["fas", "link"]}
      description="Encode URLs for safe transmission or decode encoded URLs"
      path="/tools/url-encoder-decoder"
      keywords={["url", "encode", "decode", "uri", "percent"]}
    >
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded font-medium transition ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded font-medium transition ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Encoding Mode
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="urlMode"
              checked={urlMode === 'component'}
              onChange={() => setUrlMode('component')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Component (encodeURIComponent)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="urlMode"
              checked={urlMode === 'full'}
              onChange={() => setUrlMode('full')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Full URL (encodeURI)</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'encode' ? 'URL to Encode' : 'Encoded URL to Decode'}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter URL or text...' : 'Enter encoded URL...'}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleProcess}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
          </label>
          <div className="relative">
            <textarea
              id="output"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
            />
            <CopyButton text={output} />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
