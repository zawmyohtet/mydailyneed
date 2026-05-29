import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UrlEncoderDecoder from './UrlEncoderDecoder'

describe('UrlEncoderDecoder', () => {
  beforeEach(() => {
    render(<UrlEncoderDecoder />)
  })

  it('renders with title', () => {
    expect(screen.getByText('URL Encoder/Decoder')).toBeInTheDocument()
  })

  it('has encode and decode mode buttons', () => {
    const buttons = screen.getAllByRole('button', { name: 'Encode' })
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Decode' })).toBeInTheDocument()
  })

  it('encodes URL component', async () => {
    const input = screen.getByLabelText(/URL to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]

    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded URL/i)
    expect(output.value).toBe('hello%20world')
  })

  it('encodes full URL', async () => {
    const fullUrlRadio = screen.getByLabelText(/Full URL/i)
    fireEvent.click(fullUrlRadio)

    const input = screen.getByLabelText(/URL to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]

    fireEvent.change(input, { target: { value: 'https://example.com/path with spaces' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded URL/i)
    expect(output.value).toBe('https://example.com/path%20with%20spaces')
  })

  it('decodes URL component', async () => {
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    const modeButton = decodeButtons[0]
    fireEvent.click(modeButton)

    await waitFor(() => {
      const input = screen.getByLabelText(/Encoded URL to Decode/i)
      const decodeButtons2 = screen.getAllByRole('button', { name: 'Decode' })
      const processButton = decodeButtons2[decodeButtons2.length - 1]

      fireEvent.change(input, { target: { value: 'hello%20world' } })
      fireEvent.click(processButton)

      const output = screen.getByLabelText(/Decoded URL/i)
      expect(output.value).toBe('hello world')
    })
  })

  it('shows error for invalid encoded input', async () => {
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    const modeButton = decodeButtons[0]
    fireEvent.click(modeButton)

    await waitFor(() => {
      const input = screen.getByLabelText(/Encoded URL to Decode/i)
      const decodeButtons2 = screen.getAllByRole('button', { name: 'Decode' })
      const processButton = decodeButtons2[decodeButtons2.length - 1]

      fireEvent.change(input, { target: { value: '%ZZ' } })
      fireEvent.click(processButton)

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText(/Invalid encoded/i)).toBeInTheDocument()
    })
  })

  it('clear button resets input and output', async () => {
    const input = screen.getByLabelText(/URL to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]
    const clearButton = screen.getByRole('button', { name: 'Clear' })

    fireEvent.change(input, { target: { value: 'hello world' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded URL/i)
    expect(output.value).toBe('hello%20world')

    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(output.value).toBe('')
  })

  it('handles empty input', async () => {
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]
    fireEvent.click(processButton)

    expect(screen.queryByText('Error')).not.toBeInTheDocument()
  })

  it('encodes special characters', async () => {
    const input = screen.getByLabelText(/URL to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]

    fireEvent.change(input, { target: { value: 'a&b=c' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded URL/i)
    expect(output.value).toBe('a%26b%3Dc')
  })
})
