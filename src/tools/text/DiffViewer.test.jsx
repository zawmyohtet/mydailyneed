import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DiffViewer from './DiffViewer'
import { computeDiff } from '../../utils/textTransforms'

describe('DiffViewer', () => {
  beforeEach(() => {
    render(<DiffViewer />)
  })

  it('renders with title and description', () => {
    expect(screen.getByText('Diff Viewer')).toBeInTheDocument()
    expect(screen.getByText('Compare two texts side by side and highlight differences')).toBeInTheDocument()
  })

  it('shows input areas and buttons', () => {
    expect(screen.getByLabelText('Original')).toBeInTheDocument()
    expect(screen.getByLabelText('Modified')).toBeInTheDocument()
    expect(screen.getByText('Compare')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('no diff output initially', () => {
    expect(screen.queryByText('Differences')).not.toBeInTheDocument()
  })

  it('compare button shows diff output', () => {
    fireEvent.change(screen.getByLabelText('Original'), { target: { value: 'hello' } })
    fireEvent.change(screen.getByLabelText('Modified'), { target: { value: 'world' } })
    fireEvent.click(screen.getByText('Compare'))
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('clear button resets everything', () => {
    const original = screen.getByLabelText('Original')
    const modified = screen.getByLabelText('Modified')
    fireEvent.change(original, { target: { value: 'a' } })
    fireEvent.change(modified, { target: { value: 'b' } })
    fireEvent.click(screen.getByText('Compare'))
    fireEvent.click(screen.getByText('Clear'))
    expect(original).toHaveValue('')
    expect(modified).toHaveValue('')
    expect(screen.queryByText('Differences')).not.toBeInTheDocument()
  })

  it('can switch between line and word mode', () => {
    fireEvent.click(screen.getByText('Word'))
    fireEvent.change(screen.getByLabelText('Original'), { target: { value: 'hello world' } })
    fireEvent.change(screen.getByLabelText('Modified'), { target: { value: 'hello earth' } })
    fireEvent.click(screen.getByText('Compare'))
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('handles large input without crashing', () => {
    const largeLeft = Array.from({ length: 5000 }, (_, i) => `line ${i}`).join('\n')
    const largeRight = Array.from({ length: 5000 }, (_, i) => `line ${i === 100 ? 999 : i}`).join('\n')
    fireEvent.change(screen.getByLabelText('Original'), { target: { value: largeLeft } })
    fireEvent.change(screen.getByLabelText('Modified'), { target: { value: largeRight } })
    fireEvent.click(screen.getByText('Compare'))
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('handles one empty and one non-empty input', () => {
    fireEvent.change(screen.getByLabelText('Original'), { target: { value: 'some text' } })
    fireEvent.click(screen.getByText('Compare'))
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })
})

describe('computeDiff', () => {
  it('returns empty arrays for empty inputs', () => {
    const result = computeDiff('', '')
    expect(result.left).toEqual([])
    expect(result.right).toEqual([])
  })

  it('returns empty arrays for null inputs', () => {
    const result = computeDiff(null, null)
    expect(result.left).toEqual([])
    expect(result.right).toEqual([])
  })

  it('detects identical texts as unchanged', () => {
    const result = computeDiff('hello\nworld', 'hello\nworld')
    expect(result.left.every(c => c.type === 'unchanged')).toBe(true)
    expect(result.right.every(c => c.type === 'unchanged')).toBe(true)
    expect(result.left.length).toBe(2)
  })

  it('detects removed lines in line mode', () => {
    const result = computeDiff('a\nb\nc', 'a\nc', 'line')
    const removedLeft = result.left.filter(c => c.type === 'removed')
    const emptyRight = result.right.filter(c => c.type === 'empty')
    expect(removedLeft.length).toBe(1)
    expect(removedLeft[0].value).toBe('b')
    expect(emptyRight.length).toBe(1)
  })

  it('detects added lines in line mode', () => {
    const result = computeDiff('a\nc', 'a\nb\nc', 'line')
    const addedRight = result.right.filter(c => c.type === 'added')
    const emptyLeft = result.left.filter(c => c.type === 'empty')
    expect(addedRight.length).toBe(1)
    expect(addedRight[0].value).toBe('b')
    expect(emptyLeft.length).toBe(1)
  })

  it('detects word-level changes', () => {
    const result = computeDiff('hello world', 'hello earth', 'word')
    const removedLeft = result.left.filter(c => c.type === 'removed')
    const addedRight = result.right.filter(c => c.type === 'added')
    expect(removedLeft.some(c => c.value.includes('world'))).toBe(true)
    expect(addedRight.some(c => c.value.includes('earth'))).toBe(true)
  })

  it('handles empty left and non-empty right', () => {
    const result = computeDiff('', 'hello')
    expect(result.left.every(c => c.type === 'empty')).toBe(true)
    expect(result.right.every(c => c.type === 'added')).toBe(true)
    expect(result.left.length).toBe(1)
    expect(result.right.length).toBe(1)
  })

  it('handles non-empty left and empty right', () => {
    const result = computeDiff('hello', '')
    expect(result.left.every(c => c.type === 'removed')).toBe(true)
    expect(result.right.every(c => c.type === 'empty')).toBe(true)
    expect(result.left.length).toBe(1)
    expect(result.right.length).toBe(1)
  })

  it('detects mixed added and removed lines together', () => {
    const result = computeDiff('a\nb\nc', 'a\nd\nc', 'line')
    const removedLeft = result.left.filter(c => c.type === 'removed')
    const addedRight = result.right.filter(c => c.type === 'added')
    expect(removedLeft.length).toBe(1)
    expect(removedLeft[0].value).toBe('b')
    expect(addedRight.length).toBe(1)
    expect(addedRight[0].value).toBe('d')
  })

  it('maintains equal length of left and right arrays', () => {
    const result = computeDiff('a\nb\nc', 'x\ny', 'line')
    expect(result.left.length).toBe(result.right.length)
  })

  it('maintains equal length in word mode', () => {
    const result = computeDiff('hello world', 'goodbye earth', 'word')
    expect(result.left.length).toBe(result.right.length)
  })

  it('detects multiple word changes in one line', () => {
    const result = computeDiff('the quick brown fox', 'the slow red fox', 'word')
    const removedLeft = result.left.filter(c => c.type === 'removed')
    const addedRight = result.right.filter(c => c.type === 'added')
    const removedText = removedLeft.map(c => c.value).join('')
    const addedText = addedRight.map(c => c.value).join('')
    expect(removedText).toContain('quick')
    expect(removedText).toContain('brown')
    expect(addedText).toContain('slow')
    expect(addedText).toContain('red')
  })

  it('defaults to line mode when mode is omitted', () => {
    const result = computeDiff('a\nb', 'a\nc')
    const removedLeft = result.left.filter(c => c.type === 'removed')
    const addedRight = result.right.filter(c => c.type === 'added')
    expect(removedLeft.some(c => c.value === 'b')).toBe(true)
    expect(addedRight.some(c => c.value === 'c')).toBe(true)
  })

  it('handles single line with no newline', () => {
    const result = computeDiff('hello', 'world', 'line')
    expect(result.left.length).toBe(2)
    expect(result.right.length).toBe(2)
    expect(result.left.some(c => c.type === 'removed' && c.value === 'hello')).toBe(true)
    expect(result.right.some(c => c.type === 'added' && c.value === 'world')).toBe(true)
  })

  it('handles trailing newlines correctly', () => {
    const result = computeDiff('a\nb\n', 'a\nb\n', 'line')
    expect(result.left.every(c => c.type === 'unchanged')).toBe(true)
    expect(result.right.every(c => c.type === 'unchanged')).toBe(true)
  })
})
