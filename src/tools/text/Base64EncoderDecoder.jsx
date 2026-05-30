import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { encodeBase64, decodeBase64 } from '../../utils/textTransforms'

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode')
  const [error, setError] = useState(null)

  const handleProcess = () => {
    setError(null)
    try {
      const result = mode === 'encode' ? encodeBase64(input) : decodeBase64(input)
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
      title="Base64 Encoder/Decoder"
      icon={["fas", "exchange-alt"]}
      description="Encode text to Base64 or decode Base64 back to text"
      path="/tools/base64-encoder-decoder"
      keywords={["base64", "encode", "decode", "text", "binary"]}
    >
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded font-medium transition ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded font-medium transition ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
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
            {mode === 'encode' ? 'Encoded Base64' : 'Decoded Text'}
          </label>
          <div className="relative">
            <textarea
              id="output"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm resize-none text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <CopyButton text={output} />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
