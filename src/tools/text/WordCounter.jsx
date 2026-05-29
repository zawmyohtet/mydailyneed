import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { countStats } from '../../utils/textTransforms'

export default function WordCounter() {
  const [text, setText] = useState('')
  const stats = countStats(text)

  const handleClear = () => {
    setText('')
  }

  return (
    <ToolLayout
      title="Word Counter"
      icon={["fas", "calculator"]}
      description="Count words, characters, sentences, and more in your text"
      path="/tools/word-counter"
      keywords={["word", "count", "character", "sentence", "paragraph", "stats"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your text
          </label>
          <textarea
            id="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.words}</p>
            <p className="text-sm text-blue-700">Words</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.chars}</p>
            <p className="text-sm text-green-700">Characters</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{stats.charsNoSpaces}</p>
            <p className="text-sm text-purple-700">No Spaces</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.sentences}</p>
            <p className="text-sm text-yellow-700">Sentences</p>
          </div>
          <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <p className="text-2xl font-bold text-pink-600">{stats.paragraphs}</p>
            <p className="text-sm text-pink-700">Paragraphs</p>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">{stats.lines}</p>
            <p className="text-sm text-indigo-700">Lines</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.readingTime}</p>
            <p className="text-sm text-red-700">Min Read</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
