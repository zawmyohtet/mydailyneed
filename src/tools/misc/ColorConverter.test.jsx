import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ColorConverter from './ColorConverter'

describe('ColorConverter', () => {
  it('renders with title', () => {
    render(<ColorConverter />)
    expect(screen.getByText('Color Converter')).toBeInTheDocument()
  })

  it('has input field', () => {
    render(<ColorConverter />)
    expect(screen.getByPlaceholderText('#RRGGBB')).toBeInTheDocument()
  })

  it('has format radio buttons', () => {
    render(<ColorConverter />)
    expect(screen.getByLabelText('HEX')).toBeInTheDocument()
    expect(screen.getByLabelText('RGB')).toBeInTheDocument()
    expect(screen.getByLabelText('HSL')).toBeInTheDocument()
  })

  it('has convert and clear buttons', () => {
    render(<ColorConverter />)
    expect(screen.getByRole('button', { name: /Convert/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('converts HEX to other formats', () => {
    render(<ColorConverter />)
    const input = screen.getByPlaceholderText('#RRGGBB')
    fireEvent.change(input, { target: { value: '#ff0000' } })
    const convertButton = screen.getByRole('button', { name: /Convert/i })
    fireEvent.click(convertButton)
    expect(screen.getByDisplayValue('#FF0000')).toBeInTheDocument()
  })

  it('shows color preview', () => {
    render(<ColorConverter />)
    const input = screen.getByPlaceholderText('#RRGGBB')
    fireEvent.change(input, { target: { value: '#ff0000' } })
    const convertButton = screen.getByRole('button', { name: /Convert/i })
    fireEvent.click(convertButton)
    const preview = screen.getByTestId('color-preview')
    expect(preview).toBeInTheDocument()
  })

  it('shows error for invalid HEX', () => {
    render(<ColorConverter />)
    const input = screen.getByPlaceholderText('#RRGGBB')
    fireEvent.change(input, { target: { value: 'invalid' } })
    const convertButton = screen.getByRole('button', { name: /Convert/i })
    fireEvent.click(convertButton)
    expect(screen.getByText(/Invalid HEX/i)).toBeInTheDocument()
  })
})
