import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import JsonAttributeExtractor from './JsonAttributeExtractor'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

const sampleJson = JSON.stringify([
  { id: 1, name: 'Alice', email: 'alice@example.com', address: { city: 'Singapore' } },
  { id: 2, name: 'Bob', email: 'bob@example.com', address: { city: 'Tokyo' } },
])

describe('JsonAttributeExtractor', () => {
  it('renders with empty state', () => {
    render(<JsonAttributeExtractor />)
    expect(screen.getByLabelText(/JSONPath Expression/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Paste your JSON/i)).toBeInTheDocument()
  })

  it('shows error for invalid JSON', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: '{invalid}' } })
    fireEvent.change(pathInput, { target: { value: '$' } })

    await waitFor(() => {
      expect(screen.getByText(/Expected|Invalid|Unexpected/i)).toBeInTheDocument()
    })
  })

  it('extracts all name values with $[*].name', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$[*].name' } })

    await waitFor(() => {
      const output = screen.getByPlaceholderText(/Extracted attributes/i)
      expect(output.value).toContain('Alice')
      expect(output.value).toContain('Bob')
    })
  })

  it('extracts first element with $[0]', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$[0]' } })

    await waitFor(() => {
      const output = screen.getByPlaceholderText(/Extracted attributes/i)
      expect(output.value).toContain('Alice')
    })
  })

  it('extracts nested value with $[*].address.city', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$[*].address.city' } })

    await waitFor(() => {
      const output = screen.getByPlaceholderText(/Extracted attributes/i)
      expect(output.value).toContain('Singapore')
      expect(output.value).toContain('Tokyo')
    })
  })

  it('extracts all emails recursively with $..email', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$..email' } })

    await waitFor(() => {
      const output = screen.getByPlaceholderText(/Extracted attributes/i)
      expect(output.value).toContain('alice@example.com')
      expect(output.value).toContain('bob@example.com')
    })
  })

  it('clear button resets all fields', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$[*].name' } })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Extracted attributes/i).value).toBeTruthy()
    })

    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(pathInput.value).toBe('')
    expect(screen.getByPlaceholderText(/Extracted attributes/i).value).toBe('')
  })

  it('load sample button populates input and path', () => {
    render(<JsonAttributeExtractor />)
    const loadButton = screen.getByRole('button', { name: /load sample/i })
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.click(loadButton)

    expect(input.value).toContain('Alice')
    expect(pathInput.value).toBe('$[*].name')
  })

  it('copy button appears when output exists', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$[*].name' } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
    })
  })

  it('clears output when path is empty', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '$[*].name' } })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Extracted attributes/i).value).toBeTruthy()
    })

    fireEvent.change(pathInput, { target: { value: '' } })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Extracted attributes/i).value).toBe('')
    })
  })

  it('example path buttons set the path input', async () => {
    render(<JsonAttributeExtractor />)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)
    const exampleButton = screen.getByRole('button', { name: /\$\[\*\]\.id/ })

    fireEvent.click(exampleButton)

    expect(pathInput.value).toBe('$[*].id')
  })

  it('shows error for invalid path expression', async () => {
    render(<JsonAttributeExtractor />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const pathInput = screen.getByLabelText(/JSONPath Expression/i)

    fireEvent.change(input, { target: { value: sampleJson } })
    fireEvent.change(pathInput, { target: { value: '[invalid' } })

    await waitFor(() => {
      expect(screen.getByText(/Path must start/i)).toBeInTheDocument()
    })
  })
})
