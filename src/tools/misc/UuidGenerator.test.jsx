import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UuidGenerator from './UuidGenerator'

describe('UuidGenerator', () => {
  it('renders with title', () => {
    render(<UuidGenerator />)
    expect(screen.getByText('UUID Generator')).toBeInTheDocument()
  })

  it('has count input defaulting to 1', () => {
    render(<UuidGenerator />)
    const countInput = screen.getByLabelText(/Number of UUIDs/i)
    expect(countInput).toBeInTheDocument()
    expect(countInput.value).toBe('1')
  })

  it('has generate and clear buttons', () => {
    render(<UuidGenerator />)
    expect(screen.getByRole('button', { name: /Generate/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('generates UUID with valid format', () => {
    render(<UuidGenerator />)
    const generateButton = screen.getByRole('button', { name: /Generate/i })
    fireEvent.click(generateButton)
    const uuidInput = screen.getByDisplayValue(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    expect(uuidInput).toBeInTheDocument()
  })

  it('generates multiple UUIDs', () => {
    render(<UuidGenerator />)
    const countInput = screen.getByLabelText(/Number of UUIDs/i)
    fireEvent.change(countInput, { target: { value: '3' } })
    const generateButton = screen.getByRole('button', { name: /Generate/i })
    fireEvent.click(generateButton)
    const uuidInputs = screen.getAllByDisplayValue(/^[0-9a-f]{8}-/i)
    expect(uuidInputs.length).toBe(3)
  })

  it('has copy all button after generation', () => {
    render(<UuidGenerator />)
    const generateButton = screen.getByRole('button', { name: /Generate/i })
    fireEvent.click(generateButton)
    expect(screen.getByRole('button', { name: /Copy All/i })).toBeInTheDocument()
  })

  it('clear removes UUIDs', () => {
    render(<UuidGenerator />)
    const generateButton = screen.getByRole('button', { name: /Generate/i })
    fireEvent.click(generateButton)
    expect(screen.getByDisplayValue(/^[0-9a-f]{8}-/i)).toBeInTheDocument()
    const clearButton = screen.getByRole('button', { name: /Clear/i })
    fireEvent.click(clearButton)
    expect(screen.queryByDisplayValue(/^[0-9a-f]{8}-/i)).not.toBeInTheDocument()
  })
})
