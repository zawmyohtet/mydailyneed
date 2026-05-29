import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { computeDiff } from '../../utils/textTransforms'

export default function DiffViewer() {
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [mode, setMode] = useState('line')
  const [diffResult, setDiffResult] = useState(null)

  const handleCompare = () => {
    const result = computeDiff(leftInput, rightInput, mode)
    setDiffResult(result)
  }

  const handleClear = () => {
    setLeftInput('')
    setRightInput('')
    setDiffResult(null)
  }

  return (
    <ToolLayout
      title="Diff Viewer"
      icon={["fas", "code-compare"]}
      description="Compare two texts side by side and highlight differences"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="leftInput" className="block text-sm font-medium text-gray-700 mb-1">
              Original
            </label>
            <textarea
              id="leftInput"
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none font-mono"
            />
          </div>
          <div>
            <label htmlFor="rightInput" className="block text-sm font-medium text-gray-700 mb-1">
              Modified
            </label>
            <textarea
              id="rightInput"
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none font-mono"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setMode('line')}
              className={`px-4 py-2 text-sm font-medium transition ${
                mode === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setMode('word')}
              className={`px-4 py-2 text-sm font-medium transition ${
                mode === 'word'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Word
            </button>
          </div>
          <button
            onClick={handleCompare}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Compare
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
        </div>

        {diffResult && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Differences
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                <div className="bg-red-50/50">
                  <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-300 text-xs font-medium text-gray-600">
                    Original
                  </div>
                  <div className="max-h-96 overflow-auto font-mono text-sm">
                    {diffResult.left.map((chunk, i) => (
                      <div
                        key={i}
                        className={`px-3 whitespace-pre-wrap break-all min-h-[1.5rem] leading-6 ${
                          chunk.type === 'removed'
                            ? 'bg-red-100 text-red-800'
                            : chunk.type === 'empty'
                            ? 'bg-gray-100'
                            : ''
                        }`}
                      >
                        {chunk.value}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50/50">
                  <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-300 text-xs font-medium text-gray-600">
                    Modified
                  </div>
                  <div className="max-h-96 overflow-auto font-mono text-sm">
                    {diffResult.right.map((chunk, i) => (
                      <div
                        key={i}
                        className={`px-3 whitespace-pre-wrap break-all min-h-[1.5rem] leading-6 ${
                          chunk.type === 'added'
                            ? 'bg-green-100 text-green-800'
                            : chunk.type === 'empty'
                            ? 'bg-gray-100'
                            : ''
                        }`}
                      >
                        {chunk.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
