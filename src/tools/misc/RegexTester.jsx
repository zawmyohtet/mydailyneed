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
      path="/tools/regex-tester"
      keywords={["regex", "regexp", "pattern", "match", "test"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Regular Expression
          </label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-600 dark:text-gray-400">
              /
            </span>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g., \d+ or [a-z]+"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-600 dark:text-gray-400">
              /
            </span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="testString" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Test String
          </label>
          <textarea
            id="testString"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the regex..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
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
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`font-medium ${result.valid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                {result.valid ? 'Valid Pattern' : 'Invalid Pattern'}
              </p>
              <p className={`text-sm ${result.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                Matches: {result.matchCount}
              </p>
            </div>
            
            {!result.valid && (
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">{result.error}</p>
            )}

            {result.valid && result.matches.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Matches:</p>
                <div className="flex flex-wrap gap-2">
                  {result.matches.map((match, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded font-mono text-sm"
                    >
                      {match}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.valid && result.matches.length === 0 && (
              <p className="text-green-700 dark:text-green-400 text-sm mt-1">No matches found</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
