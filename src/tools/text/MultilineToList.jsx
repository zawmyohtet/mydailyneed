import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { multilineToCommaList } from '../../utils/textTransforms'

export default function MultilineToList() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [separator, setSeparator] = useState(', ')
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)

  const handleConvert = () => {
    const result = multilineToCommaList(input, { separator, trimWhitespace, removeEmpty })
    setOutput(result)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <ToolLayout
      title="Multiline to List"
      icon={["fas", "list"]}
      description="Convert multiline text to a comma-separated list"
      path="/tools/multiline-to-list"
      keywords={["multiline", "comma", "list", "csv", "separator", "join"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter your text (one item per line)
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"1\n2\n3\n4"}
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="separator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Separator
            </label>
            <input
              id="separator"
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            Trim whitespace
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            Remove empty lines
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Convert
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Clear
          </button>
        </div>

        <div>
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Output
          </label>
          <div className="relative">
            <textarea
              id="output"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm resize-none text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <CopyButton text={output} />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
