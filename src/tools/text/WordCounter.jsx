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
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter your text
          </label>
          <textarea
            id="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">Words</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.chars}</p>
            <p className="text-sm text-green-700 dark:text-green-400">Characters</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.charsNoSpaces}</p>
            <p className="text-sm text-purple-700 dark:text-purple-400">No Spaces</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.sentences}</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Sentences</p>
          </div>
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.paragraphs}</p>
            <p className="text-sm text-pink-700 dark:text-pink-400">Paragraphs</p>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.lines}</p>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">Lines</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.readingTime}</p>
            <p className="text-sm text-red-700 dark:text-red-400">Min Read</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
