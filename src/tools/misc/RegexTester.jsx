import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { testRegex } from '../../utils/misc'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [result, setResult] = useState(null)

  const handleTest = () => {
    const testResult = testRegex(pattern, flags, testString)
    setResult(testResult)
  }

  const handleClear = () => {
    setPattern('')
    setFlags('g')
    setTestString('')
    setResult(null)
  }

  return (
    <ToolLayout
      title="Regex Tester"
      icon={["fas", "search"]}
      description="Test and validate regular expressions with live matching"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-1">
            Regular Expression
          </label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
              /
            </span>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g., \d+ or [a-z]+"
              className="flex-1 p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <span className="flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
              /
            </span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              className="w-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="testString" className="block text-sm font-medium text-gray-700 mb-1">
            Test String
          </label>
          <textarea
            id="testString"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the regex..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleTest}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Test
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                {result.valid ? 'Valid Pattern' : 'Invalid Pattern'}
              </p>
              <p className={`text-sm ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                Matches: {result.matchCount}
              </p>
            </div>
            
            {!result.valid && (
              <p className="text-red-700 text-sm mt-1">{result.error}</p>
            )}

            {result.valid && result.matches.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-green-800 mb-2">Matches:</p>
                <div className="flex flex-wrap gap-2">
                  {result.matches.map((match, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-sm"
                    >
                      {match}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.valid && result.matches.length === 0 && (
              <p className="text-green-700 text-sm mt-1">No matches found</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
