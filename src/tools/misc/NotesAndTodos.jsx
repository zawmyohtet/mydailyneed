import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MAX_ITEMS = 20

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function TodoPanel({ todos, setTodos }) {
  const [input, setInput] = useState('')
  const isAtLimit = todos.length >= MAX_ITEMS

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: generateId(), text, completed: false, createdAt: Date.now() }])
    setInput('')
  }

  const handleToggle = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const handleClearCompleted = () => {
    setTodos(todos.filter(t => !t.completed))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isAtLimit) handleAdd()
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Todos</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a todo..."
          disabled={isAtLimit}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleAdd}
          disabled={isAtLimit || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {isAtLimit && (
        <p className="text-amber-600 dark:text-amber-400 text-xs mb-3">
          Maximum {MAX_ITEMS} todos reached. Delete some to add more.
        </p>
      )}

      {todos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          No todos yet — add one above
        </p>
      ) : (
        <ul className="flex-1 space-y-2 overflow-y-auto">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {todo.text}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition"
                aria-label="Delete todo"
              >
                <FontAwesomeIcon icon={['fas', 'times']} className="text-xs" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {completedCount > 0 && (
        <button
          onClick={handleClearCompleted}
          className="mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition self-start"
        >
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  )
}

function NotesPanel({ notes, setNotes }) {
  const isAtLimit = notes.length >= MAX_ITEMS

  const handleAdd = () => {
    setNotes([...notes, { id: generateId(), title: '', content: '', createdAt: Date.now() }])
  }

  const handleUpdate = (id, field, value) => {
    setNotes(notes.map(n => n.id === id ? { ...n, [field]: value } : n))
  }

  const handleDelete = (id) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h2>
        <button
          onClick={handleAdd}
          disabled={isAtLimit}
          className="px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Note
        </button>
      </div>

      {isAtLimit && (
        <p className="text-amber-600 dark:text-amber-400 text-xs mb-3">
          Maximum {MAX_ITEMS} notes reached. Delete some to add more.
        </p>
      )}

      {notes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          No notes yet — create one
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-1">
          {notes.map(note => (
            <div
              key={note.id}
              className="relative p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-gray-800 group flex flex-col"
            >
              <button
                onClick={() => handleDelete(note.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition"
                aria-label="Delete note"
              >
                <FontAwesomeIcon icon={['fas', 'times']} className="text-xs" />
              </button>
              <input
                type="text"
                value={note.title}
                onChange={(e) => handleUpdate(note.id, 'title', e.target.value)}
                placeholder="Title (optional)"
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-none focus:ring-0 p-0 mb-2 pr-6"
              />
              <textarea
                value={note.content}
                onChange={(e) => handleUpdate(note.id, 'content', e.target.value)}
                placeholder="Write something..."
                rows={3}
                className="flex-1 w-full bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 border-none focus:ring-0 p-0 resize-none min-h-[60px]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NotesAndTodos() {
  const [todos, setTodos] = useLocalStorage('mdn-todos', [])
  const [notes, setNotes] = useLocalStorage('mdn-notes', [])

  return (
    <ToolLayout
      title="Notes & Todos"
      icon={['fas', 'sticky-note']}
      description="Quick notes and todo lists saved locally in your browser"
      path="/tools/notes-and-todos"
      keywords={['notes', 'todos', 'sticky', 'reminders', 'tasks']}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <div className="border-r border-gray-200 dark:border-gray-700 pr-6">
          <TodoPanel todos={todos} setTodos={setTodos} />
        </div>
        <div>
          <NotesPanel notes={notes} setNotes={setNotes} />
        </div>
      </div>
    </ToolLayout>
  )
}
