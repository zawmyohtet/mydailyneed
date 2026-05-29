import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { convertCase } from '../../utils/textTransforms'

const CASE_OPTIONS = [
  { value: 'UPPERCASE', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'Title Case', label: 'Title Case' },
  { value: 'Sentence case', label: 'Sentence case' },
  { value: 'camelCase', label: 'camelCase' },
  { value: 'PascalCase', label: 'PascalCase' },
  { value: 'snake_case', label: 'snake_case' },
  { value: 'kebab-case', label: 'kebab-case' },
  { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
]

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedCase, setSelectedCase] = useState('UPPERCASE')

  const handleConvert = () => {
    const result = convertCase(input, selectedCase)
    setOutput(result)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <ToolLayout
      title="Case Converter"
      icon={["fas", "font"]}
      description="Convert text between different case formats"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your text
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          />
        </div>

        <div>
          <label htmlFor="caseSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select case format
          </label>
          <select
            id="caseSelect"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {CASE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
        </div>

        <div>
          <label htmlFor="output" className="block text-sm font-medium text-gray-700 mb-1">
            Converted text
          </label>
          <div className="relative">
            <textarea
              id="output"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
            />
            <CopyButton text={output} />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
