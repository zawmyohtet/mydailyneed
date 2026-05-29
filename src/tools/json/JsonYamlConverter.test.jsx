import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import JsonYamlConverter from './JsonYamlConverter'

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('JsonYamlConverter', () => {
  it('renders with empty input', () => {
    render(<JsonYamlConverter />)
    expect(screen.getByPlaceholderText(/Paste JSON/i)).toBeInTheDocument()
  })

  it('converts JSON to YAML', async () => {
    render(<JsonYamlConverter />)
    const input = screen.getByPlaceholderText(/Paste JSON/i)
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.change(input, { target: { value: '{"name":"test","value":123}' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Converted output/i)).toBeInTheDocument()
    })
  })

  it('converts YAML to JSON', async () => {
    render(<JsonYamlConverter />)
    const directionButton = screen.getByRole('button', { name: /YAML → JSON/i })
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.click(directionButton)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste YAML/i)).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText(/Paste YAML/i)
    fireEvent.change(input, { target: { value: 'name: test\nvalue: 123' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Converted output/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<JsonYamlConverter />)
    const input = screen.getByPlaceholderText(/Paste JSON/i)
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.change(input, { target: { value: '{invalid json}' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      const errorElement = screen.getByText(/invalid/i)
      expect(errorElement).toBeInTheDocument()
    })
  })

  it('shows error for invalid YAML', async () => {
    render(<JsonYamlConverter />)
    const directionButton = screen.getByRole('button', { name: /YAML → JSON/i })
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.click(directionButton)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste YAML/i)).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText(/Paste YAML/i)
    fireEvent.change(input, { target: { value: 'invalid: yaml: : :' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      expect(screen.getAllByText(/bad indentation/i)[0]).toBeInTheDocument()
    })
  })

  it('handles nested objects', async () => {
    render(<JsonYamlConverter />)
    const input = screen.getByPlaceholderText(/Paste JSON/i)
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.change(input, { target: { value: '{"user":{"name":"John","age":30}}' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      const output = screen.getByPlaceholderText(/Converted output/i)
      expect(output.value).toContain('user')
    })
  })

  it('handles arrays', async () => {
    render(<JsonYamlConverter />)
    const input = screen.getByPlaceholderText(/Paste JSON/i)
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.change(input, { target: { value: '[1,2,3]' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      expect(screen.queryByText(/Unexpected token/i)).not.toBeInTheDocument()
    })
  })

  it('copy button is present when output exists', async () => {
    render(<JsonYamlConverter />)
    const input = screen.getByPlaceholderText(/Paste JSON/i)
    const convertButton = screen.getByRole('button', { name: /convert/i })

    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(convertButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
    })
  })

  it('clear button resets all', async () => {
    render(<JsonYamlConverter />)
    const input = screen.getByPlaceholderText(/Paste JSON/i)
    const convertButton = screen.getByRole('button', { name: /convert/i })
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Converted output/i)).toBeInTheDocument()
    })
    
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
    expect(screen.getByPlaceholderText(/Converted output/i).value).toBe('')
  })

  it('direction toggle switches input placeholder', async () => {
    render(<JsonYamlConverter />)
    const directionButton = screen.getByRole('button', { name: /YAML → JSON/i })

    fireEvent.click(directionButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste YAML/i)).toBeInTheDocument()
    })
  })
})
