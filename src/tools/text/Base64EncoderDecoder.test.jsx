import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Base64EncoderDecoder from './Base64EncoderDecoder'

describe('Base64EncoderDecoder', () => {
  beforeEach(() => {
    render(<Base64EncoderDecoder />)
  })

  it('renders with title', () => {
    expect(screen.getByText('Base64 Encoder/Decoder')).toBeInTheDocument()
  })

  it('has encode and decode mode buttons', () => {
    const buttons = screen.getAllByRole('button', { name: 'Encode' })
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Decode' })).toBeInTheDocument()
  })

  it('encodes text to base64', async () => {
    const input = screen.getByLabelText(/Text to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded Base64/i)
    expect(output.value).toBe('SGVsbG8=')
  })

  it('decodes base64 to text', async () => {
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    const modeButton = decodeButtons[0]
    fireEvent.click(modeButton)

    await waitFor(() => {
      const input = screen.getByLabelText(/Base64 to Decode/i)
      const decodeButtons2 = screen.getAllByRole('button', { name: 'Decode' })
      const processButton = decodeButtons2[decodeButtons2.length - 1]

      fireEvent.change(input, { target: { value: 'SGVsbG8=' } })
      fireEvent.click(processButton)

      const output = screen.getByLabelText(/Decoded Text/i)
      expect(output.value).toBe('Hello')
    })
  })

  it('shows error for invalid base64', async () => {
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    const modeButton = decodeButtons[0]
    fireEvent.click(modeButton)

    await waitFor(() => {
      const input = screen.getByLabelText(/Base64 to Decode/i)
      const decodeButtons2 = screen.getAllByRole('button', { name: 'Decode' })
      const processButton = decodeButtons2[decodeButtons2.length - 1]

      fireEvent.change(input, { target: { value: 'invalid!!!' } })
      fireEvent.click(processButton)

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText(/Invalid Base64/i)).toBeInTheDocument()
    })
  })

  it('clear button resets input and output', async () => {
    const input = screen.getByLabelText(/Text to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]
    const clearButton = screen.getByRole('button', { name: 'Clear' })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded Base64/i)
    expect(output.value).toBe('SGVsbG8=')

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

  it('encodes UTF-8 characters', async () => {
    const input = screen.getByLabelText(/Text to Encode/i)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    const processButton = encodeButtons[encodeButtons.length - 1]

    fireEvent.change(input, { target: { value: '你好' } })
    fireEvent.click(processButton)

    const output = screen.getByLabelText(/Encoded Base64/i)
    expect(output.value).toBe('5L2g5aW9')
  })
})
