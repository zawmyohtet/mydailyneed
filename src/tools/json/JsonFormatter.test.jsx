import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JsonFormatter from './JsonFormatter'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('JsonFormatter', () => {
  it('renders with empty input', () => {
    render(<JsonFormatter />)
    expect(screen.getByPlaceholderText(/Paste your JSON/i)).toBeInTheDocument()
  })

  it('formats valid JSON', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '{"name":"test","value":123}' } })
    fireEvent.click(formatButton)

    expect(screen.getByPlaceholderText(/Formatted JSON/i)).toBeInTheDocument()
  })

  it('shows error for invalid JSON', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '{invalid json}' } })
    fireEvent.click(formatButton)

    expect(screen.getByText(/Invalid/i)).toBeInTheDocument()
  })

  it('handles empty object', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '{}' } })
    fireEvent.click(formatButton)

    expect(screen.queryByText(/Invalid/i)).not.toBeInTheDocument()
  })

  it('handles empty array', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '[]' } })
    fireEvent.click(formatButton)

    expect(screen.queryByText(/Invalid/i)).not.toBeInTheDocument()
  })

  it('respects 2-space indent setting', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '{"a":1}' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted JSON/i)
    expect(output.value).toContain('  "a": 1')
  })

  it('respects 4-space indent setting', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const indentSelect = screen.getByLabelText(/Indent:/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(indentSelect, { target: { value: '4' } })
    fireEvent.change(input, { target: { value: '{"a":1}' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted JSON/i)
    expect(output.value).toContain('    "a": 1')
  })

  it('clear button resets input and output', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(formatButton)
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(screen.getByPlaceholderText(/Formatted JSON/i).value).toBe('')
  })

  it('copy button is present when output exists', async () => {
    render(<JsonFormatter />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(formatButton)

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })
})
