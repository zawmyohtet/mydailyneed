import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { decodeJwt } from '../../utils/misc'

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleDecode = () => {
    setError(null)
    const decoded = decodeJwt(token.trim())
    
    if (!decoded.valid) {
      setError(decoded.error)
      setResult(null)
    } else {
      setResult(decoded)
    }
  }

  const handleClear = () => {
    setToken('')
    setResult(null)
    setError(null)
  }

  const handleSample = () => {
    setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
    setError(null)
    setResult(null)
  }

  return (
    <ToolLayout
      title="JWT Decoder"
      icon={["fas", "key"]}
      description="Decode JSON Web Tokens to view header and payload"
      path="/tools/jwt-decoder"
      keywords={["jwt", "token", "decode", "auth", "header", "payload"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            JWT Token
          </label>
          <textarea
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here (eyJ...)"
            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDecode}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Decode
          </button>
          <button
            onClick={handleSample}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Load Sample
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Clear
          </button>
        </div>

        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            <strong>Warning:</strong> This tool decodes JWT tokens but does NOT verify signatures. Do not trust unverified tokens for authentication.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm font-medium">Error</p>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Header</h3>
                <CopyButton text={JSON.stringify(result.header, null, 2)} />
              </div>
              <pre className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  {JSON.stringify(result.header, null, 2)}
                </code>
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Payload</h3>
                <CopyButton text={JSON.stringify(result.payload, null, 2)} />
              </div>
              <pre className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  {JSON.stringify(result.payload, null, 2)}
                </code>
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Signature</h3>
                <CopyButton text={result.signature} />
              </div>
              <pre className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                  {result.signature}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
