import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { generateUuid } from '../../utils/misc'

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([])
  const [count, setCount] = useState(1)

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateUuid())
    setUuids(newUuids)
  }

  const handleClear = () => {
    setUuids([])
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
  }

  return (
    <ToolLayout
      title="UUID Generator"
      icon={["fas", "fingerprint"]}
      description="Generate random UUID v4 identifiers"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
            Number of UUIDs to generate
          </label>
          <input
            id="count"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Generate
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
          {uuids.length > 0 && (
            <button
              onClick={handleCopyAll}
              data-action="copy"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Copy All
            </button>
          )}
        </div>

        {uuids.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated UUIDs ({uuids.length})
            </label>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={uuid}
                    readOnly
                    className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <CopyButton text={uuid} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
