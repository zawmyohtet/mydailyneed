import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import XmlFormatter from './XmlFormatter'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('XmlFormatter', () => {
  it('renders with empty input', () => {
    render(<XmlFormatter />)
    expect(screen.getByPlaceholderText(/Paste your XML/i)).toBeInTheDocument()
  })

  it('formats valid XML', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root><child>text</child></root>' } })
    fireEvent.click(formatButton)

    expect(screen.getByPlaceholderText(/Formatted XML/i)).toBeInTheDocument()
  })

  it('shows error for invalid XML', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root><unclosed>' } })
    fireEvent.click(formatButton)

    await new Promise(resolve => setTimeout(resolve, 10))
    const errorElements = screen.queryAllByText(/parsererror|error|unclosed/i)
    expect(errorElements.length).toBeGreaterThan(0)
  })

  it('preserves comments', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root><!-- comment --></root>' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted XML/i)
    expect(output.value).toContain('comment')
  })

  it('handles nested elements', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root><parent><child>text</child></parent></root>' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted XML/i)
    expect(output.value).toContain('<parent>')
    expect(output.value).toContain('<child>')
  })

  it('handles attributes', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root attr="value"/>' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted XML/i)
    expect(output.value).toContain('attr="value"')
  })

  it('respects 2-space indent setting', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root><child/></root>' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted XML/i)
    expect(output.value).toContain('  <child/>')
  })

  it('respects 4-space indent setting', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const indentSelect = screen.getByLabelText(/Indent:/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(indentSelect, { target: { value: '4' } })
    fireEvent.change(input, { target: { value: '<root><child/></root>' } })
    fireEvent.click(formatButton)

    const output = screen.getByPlaceholderText(/Formatted XML/i)
    expect(output.value).toContain('    <child/>')
  })

  it('copy button is present when output exists', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })

    fireEvent.change(input, { target: { value: '<root/>' } })
    fireEvent.click(formatButton)

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('clear button resets input and output', async () => {
    render(<XmlFormatter />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const formatButton = screen.getByRole('button', { name: /format/i })
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(input, { target: { value: '<root/>' } })
    fireEvent.click(formatButton)
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(screen.getByPlaceholderText(/Formatted XML/i).value).toBe('')
  })
})
