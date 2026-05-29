import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MultilineToList from './MultilineToList'

describe('MultilineToList', () => {
  beforeEach(() => {
    render(<MultilineToList />)
  })

  it('renders with title and description', () => {
    expect(screen.getByText('Multiline to List')).toBeInTheDocument()
    expect(screen.getByText('Convert multiline text to a comma-separated list')).toBeInTheDocument()
  })

  it('shows empty output initially', () => {
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })

  it('converts multiline input to comma-separated list', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    fireEvent.change(input, { target: { value: '1\n2\n3\n4' } })
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('1, 2, 3, 4')
  })

  it('uses custom separator', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    const separatorInput = screen.getByLabelText('Separator')
    fireEvent.change(separatorInput, { target: { value: ' | ' } })
    fireEvent.change(input, { target: { value: 'apple\nbanana\ncherry' } })
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('apple | banana | cherry')
  })

  it('removes empty lines by default', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    fireEvent.change(input, { target: { value: '1\n\n2\n\n3' } })
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('1, 2, 3')
  })

  it('keeps empty lines when removeEmpty is unchecked', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    const removeEmptyCheckbox = screen.getByLabelText('Remove empty lines')
    fireEvent.click(removeEmptyCheckbox)
    fireEvent.change(input, { target: { value: '1\n\n2' } })
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('1, , 2')
  })

  it('trims whitespace by default', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    fireEvent.change(input, { target: { value: '  1  \n  2  ' } })
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('1, 2')
  })

  it('keeps whitespace when trimWhitespace is unchecked', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    const trimCheckbox = screen.getByLabelText('Trim whitespace')
    fireEvent.click(trimCheckbox)
    fireEvent.change(input, { target: { value: '  1  \n  2  ' } })
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('  1  ,   2  ')
  })

  it('handles empty input', () => {
    fireEvent.click(screen.getByText('Convert'))
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })

  it('clear button resets all fields', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    fireEvent.change(input, { target: { value: 'hello\nworld' } })
    fireEvent.click(screen.getByText('Convert'))
    fireEvent.click(screen.getByText('Clear'))
    expect(input).toHaveValue('')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })

  it('handles large input without crashing', () => {
    const input = screen.getByLabelText('Enter your text (one item per line)')
    const largeInput = Array.from({ length: 10000 }, (_, i) => `item${i}`).join('\n')
    fireEvent.change(input, { target: { value: largeInput } })
    fireEvent.click(screen.getByText('Convert'))
    const output = screen.getByLabelText('Output')
    expect(output.value).toContain('item0')
    expect(output.value).toContain('item9999')
  })
})
