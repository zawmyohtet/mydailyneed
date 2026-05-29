import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import XmlMinifier from './XmlMinifier'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('XmlMinifier', () => {
  it('renders with empty input', () => {
    render(<XmlMinifier />)
    expect(screen.getByPlaceholderText(/Paste your XML/i)).toBeInTheDocument()
  })

  it('minifies valid XML', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '<root>\n  <child>text</child>\n</root>' } })
    fireEvent.click(minifyButton)

    expect(screen.getByPlaceholderText(/Minified XML/i)).toHaveValue('<root><child>text</child></root>')
  })

  it('shows error for invalid XML', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '<root><unclosed>' } })
    fireEvent.click(minifyButton)

    await new Promise(resolve => setTimeout(resolve, 10))
    const errorElements = screen.queryAllByText(/parsererror|error|unclosed/i)
    expect(errorElements.length).toBeGreaterThan(0)
  })

  it('strips comments by default', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '<root><!-- comment --></root>' } })
    fireEvent.click(minifyButton)

    const output = screen.getByPlaceholderText(/Minified XML/i)
    expect(output.value).not.toContain('<!--')
  })

  it('preserves comments when toggle on', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const commentToggle = screen.getByLabelText(/Preserve comments/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.click(commentToggle)
    fireEvent.change(input, { target: { value: '<root><!-- comment --></root>' } })
    fireEvent.click(minifyButton)

    const output = screen.getByPlaceholderText(/Minified XML/i)
    expect(output.value).toContain('<!-- comment -->')
  })

  it('calculates byte savings correctly', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    const formatted = '<root>\n  <child>text</child>\n</root>'
    fireEvent.change(input, { target: { value: formatted } })
    fireEvent.click(minifyButton)

    expect(screen.getByText(/Original:/i)).toBeInTheDocument()
    expect(screen.getByText(/Minified:/i)).toBeInTheDocument()
    expect(screen.getByText(/Saved:/i)).toBeInTheDocument()
  })

  it('shows 0% savings for already minified XML', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '<root/>' } })
    fireEvent.click(minifyButton)

    expect(screen.getByText(/Saved:/i).textContent).toContain('0.0%')
  })

  it('copy button is present when output exists', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })

    fireEvent.change(input, { target: { value: '<root/>' } })
    fireEvent.click(minifyButton)

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('clear button resets all', async () => {
    render(<XmlMinifier />)
    const input = screen.getByPlaceholderText(/Paste your XML/i)
    const minifyButton = screen.getByRole('button', { name: /minify/i })
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(input, { target: { value: '<root/>' } })
    fireEvent.click(minifyButton)
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(screen.getByPlaceholderText(/Minified XML/i).value).toBe('')
    expect(screen.queryByText(/Original:/i)).not.toBeInTheDocument()
  })
})
