import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CaseConverter from './CaseConverter'

describe('CaseConverter', () => {
  beforeEach(() => {
    render(<CaseConverter />)
  })

  it('renders with title', () => {
    expect(screen.getByText('Case Converter')).toBeInTheDocument()
  })

  it('has case format dropdown', () => {
    const select = screen.getByLabelText(/Select case format/i)
    expect(select).toBeInTheDocument()
    expect(select.options.length).toBe(9)
  })

  it('converts to UPPERCASE', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'UPPERCASE' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('HELLO WORLD')
  })

  it('converts to lowercase', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'lowercase' } })
    fireEvent.change(input, { target: { value: 'HELLO WORLD' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('hello world')
  })

  it('converts to Title Case', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'Title Case' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('Hello World')
  })

  it('converts to camelCase', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'camelCase' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('helloWorld')
  })

  it('converts to PascalCase', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'PascalCase' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('HelloWorld')
  })

  it('converts to snake_case', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'snake_case' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('hello_world')
  })

  it('converts to kebab-case', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'kebab-case' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('hello-world')
  })

  it('converts to CONSTANT_CASE', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const select = screen.getByLabelText(/Select case format/i)
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(select, { target: { value: 'CONSTANT_CASE' } })
    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('HELLO_WORLD')
  })

  it('clear button resets input and output', async () => {
    const input = screen.getByLabelText(/Enter your text/i)
    const clearButton = screen.getByRole('button', { name: 'Clear' })

    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('')
  })

  it('handles empty input', async () => {
    const convertButton = screen.getByRole('button', { name: 'Convert' })
    fireEvent.click(convertButton)

    const output = screen.getByLabelText(/Converted text/i)
    expect(output.value).toBe('')
  })
})
