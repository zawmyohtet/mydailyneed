import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DuplicateFinder from './DuplicateFinder'

describe('DuplicateFinder', () => {
  beforeEach(() => {
    render(<DuplicateFinder />)
  })

  it('renders with title', () => {
    expect(screen.getByText('Duplicate Finder')).toBeInTheDocument()
  })

  it('has trim whitespace and case sensitive checkboxes', () => {
    expect(screen.getByLabelText('Trim whitespace')).toBeInTheDocument()
    expect(screen.getByLabelText('Case sensitive')).toBeInTheDocument()
  })

  it('finds duplicates in comma-separated list', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: '1, 2, 3, 4, 5, 5, 6' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toContain('5')
    expect(output.value).toContain('2 times')
    expect(output.value).toContain('Total items: 7')
    expect(output.value).toContain('Duplicate items: 1')
  })

  it('finds duplicates in newline-separated list', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: '1\n2\n3\n4\n5\n5\n6' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toContain('5')
    expect(output.value).toContain('Total items: 7')
  })

  it('reports no duplicates found when all items are unique', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: '1, 2, 3' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toBe('No duplicates found')
  })

  it('trim whitespace on finds duplicate ignoring spaces', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: 'a, a' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toContain('"a"')
  })

  it('trim whitespace off considers spaced items as different', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })
    const trimCheckbox = screen.getByLabelText('Trim whitespace')

    fireEvent.change(input, { target: { value: 'a, a' } })
    fireEvent.click(trimCheckbox)
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toBe('No duplicates found')
  })

  it('case sensitivity on treats different cases as unique', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: 'Apple, apple' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toBe('No duplicates found')
  })

  it('case sensitivity off merges case variants', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })
    const caseCheckbox = screen.getByLabelText('Case sensitive')

    fireEvent.change(input, { target: { value: 'Apple, apple' } })
    fireEvent.click(caseCheckbox)
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toContain('apple')
  })

  it('finds multiple distinct duplicates', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: '1, 1, 2, 2, 3' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toContain('"1"')
    expect(output.value).toContain('"2"')
    expect(output.value).toContain('Duplicate items: 2')
  })

  it('reports correct count for items appearing 3+ times', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })

    fireEvent.change(input, { target: { value: 'x, x, x, y' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toContain('"x"')
    expect(output.value).toContain('3 times')
  })

  it('clear button resets input and output', () => {
    const input = screen.getByLabelText('Enter your list')
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })
    const clearButton = screen.getByRole('button', { name: 'Clear' })

    fireEvent.change(input, { target: { value: '1, 1, 2' } })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).not.toBe('')

    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(output.value).toBe('')
  })

  it('handles empty input gracefully', () => {
    const findButton = screen.getByRole('button', { name: 'Find Duplicates' })
    fireEvent.click(findButton)

    const output = screen.getByLabelText('Result')
    expect(output.value).toBe('No duplicates found')
  })
})
