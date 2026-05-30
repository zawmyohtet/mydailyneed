import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import NotesAndTodos from './NotesAndTodos'

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key, initialValue) => useState(initialValue)),
}))

describe('NotesAndTodos', () => {
  it('renders with title', () => {
    render(<NotesAndTodos />)
    expect(screen.getByText('Notes & Todos')).toBeInTheDocument()
  })

  it('shows empty states for both panels', () => {
    render(<NotesAndTodos />)
    expect(screen.getByText('No todos yet — add one above')).toBeInTheDocument()
    expect(screen.getByText('No notes yet — create one')).toBeInTheDocument()
  })

  it('adds a todo', () => {
    render(<NotesAndTodos />)
    const input = screen.getByPlaceholderText('Add a todo...')
    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('adds a todo on Enter key', () => {
    render(<NotesAndTodos />)
    const input = screen.getByPlaceholderText('Add a todo...')
    fireEvent.change(input, { target: { value: 'Read book' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('Read book')).toBeInTheDocument()
  })

  it('does not add empty todo', () => {
    render(<NotesAndTodos />)
    const input = screen.getByPlaceholderText('Add a todo...')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.queryByText('   ')).not.toBeInTheDocument()
  })

  it('toggles todo completion', () => {
    render(<NotesAndTodos />)
    const input = screen.getByPlaceholderText('Add a todo...')
    fireEvent.change(input, { target: { value: 'Task one' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const todoText = screen.getByText('Task one')
    expect(todoText).toHaveClass('line-through')
  })

  it('deletes a todo', () => {
    render(<NotesAndTodos />)
    const input = screen.getByPlaceholderText('Add a todo...')
    fireEvent.change(input, { target: { value: 'Delete me' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    const listItem = screen.getByText('Delete me').closest('li')
    const deleteBtn = listItem.querySelector('[aria-label="Delete todo"]')
    fireEvent.click(deleteBtn)

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('shows clear completed button when todos are completed', () => {
    render(<NotesAndTodos />)
    const input = screen.getByPlaceholderText('Add a todo...')
    fireEvent.change(input, { target: { value: 'Done task' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(screen.getByText(/Clear completed/)).toBeInTheDocument()
  })

  it('adds a note with title and content', () => {
    render(<NotesAndTodos />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }))

    const titleInput = screen.getByPlaceholderText('Title (optional)')
    const contentInput = screen.getByPlaceholderText('Write something...')

    fireEvent.change(titleInput, { target: { value: 'Meeting notes' } })
    fireEvent.change(contentInput, { target: { value: 'Discuss project timeline' } })

    expect(titleInput.value).toBe('Meeting notes')
    expect(contentInput.value).toBe('Discuss project timeline')
  })

  it('adds a note without title', () => {
    render(<NotesAndTodos />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }))

    const contentInput = screen.getByPlaceholderText('Write something...')
    fireEvent.change(contentInput, { target: { value: 'Just content' } })

    expect(contentInput.value).toBe('Just content')
  })

  it('deletes a note', () => {
    render(<NotesAndTodos />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }))

    const noteCard = screen.getByPlaceholderText('Title (optional)').closest('div')
    const deleteBtn = noteCard.querySelector('[aria-label="Delete note"]')
    fireEvent.click(deleteBtn)

    expect(screen.queryByPlaceholderText('Title (optional)')).not.toBeInTheDocument()
  })

  it('disables todo add button at max limit', () => {
    const todos = Array.from({ length: 20 }, (_, i) => ({
      id: `todo-${i}`,
      text: `Todo ${i + 1}`,
      completed: false,
      createdAt: Date.now(),
    }))
    const notes = []

    vi.mocked(useLocalStorage).mockImplementation((key, initialValue) => {
      if (key === 'mdn-todos') return [todos, vi.fn()]
      if (key === 'mdn-notes') return [notes, vi.fn()]
      return useState(initialValue)
    })

    render(<NotesAndTodos />)
    expect(screen.getByText(/Maximum 20 todos reached/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add a todo...')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('disables note add button at max limit', () => {
    const notes = Array.from({ length: 20 }, (_, i) => ({
      id: `note-${i}`,
      title: '',
      content: `Note ${i + 1}`,
      createdAt: Date.now(),
    }))
    const todos = []

    vi.mocked(useLocalStorage).mockImplementation((key, initialValue) => {
      if (key === 'mdn-todos') return [todos, vi.fn()]
      if (key === 'mdn-notes') return [notes, vi.fn()]
      return useState(initialValue)
    })

    render(<NotesAndTodos />)
    expect(screen.getByText(/Maximum 20 notes reached/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Note' })).toBeDisabled()
  })
})
