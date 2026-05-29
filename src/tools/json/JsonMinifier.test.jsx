import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JsonMinifier from './JsonMinifier'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('JsonMinifier', () => {
  it('renders with empty input', () => {
    render(<JsonMinifier />)
    expect(screen.getByPlaceholderText(/Paste your JSON/i)).toBeInTheDocument()
  })

  it('minifies valid JSON', async () => {
    render(<JsonMinifier />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '{ "name": "test", "value": 123 }' } })
    fireEvent.click(minifyButton)

    expect(screen.getByPlaceholderText(/Minified JSON/i)).toHaveValue('{"name":"test","value":123}')
  })

  it('shows error for invalid JSON', async () => {
    render(<JsonMinifier />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '{invalid json}' } })
    fireEvent.click(minifyButton)

    expect(screen.getByText(/Invalid/i)).toBeInTheDocument()
  })

  it('calculates byte savings correctly', async () => {
    render(<JsonMinifier />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    const formatted = '{\n  "name": "test",\n  "value": 123\n}'
    fireEvent.change(input, { target: { value: formatted } })
    fireEvent.click(minifyButton)

    expect(screen.getByText(/Original:/i)).toBeInTheDocument()
    expect(screen.getByText(/Minified:/i)).toBeInTheDocument()
    expect(screen.getByText(/Saved:/i)).toBeInTheDocument()
  })

  it('shows 0% savings for already minified JSON', async () => {
    render(<JsonMinifier />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '{"a":1}' } })
    fireEvent.click(minifyButton)

    expect(screen.getByText(/Saved:/i).textContent).toContain('0.0%')
  })

  it('copy button is present when output exists', async () => {
    render(<JsonMinifier />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(minifyButton)

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('clear button resets all', async () => {
    render(<JsonMinifier />)
    const input = screen.getByPlaceholderText(/Paste your JSON/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(minifyButton)
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(screen.getByPlaceholderText(/Minified JSON/i).value).toBe('')
    expect(screen.queryByText(/Original:/i)).not.toBeInTheDocument()
  })
})
