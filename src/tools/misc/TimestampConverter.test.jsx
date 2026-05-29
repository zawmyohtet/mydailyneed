import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TimestampConverter from './TimestampConverter'

describe('TimestampConverter', () => {
  it('renders with title', () => {
    render(<TimestampConverter />)
    expect(screen.getByText('Timestamp Converter')).toBeInTheDocument()
  })

  it('has input field', () => {
    render(<TimestampConverter />)
    expect(screen.getByPlaceholderText(/1609459200000/i)).toBeInTheDocument()
  })

  it('has format dropdown with 7 options', () => {
    render(<TimestampConverter />)
    const select = screen.getByLabelText(/Output format/i)
    expect(select).toBeInTheDocument()
    expect(select.options.length).toBe(7)
  })

  it('has convert and clear buttons', () => {
    render(<TimestampConverter />)
    expect(screen.getByRole('button', { name: /Convert/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('has now button', () => {
    render(<TimestampConverter />)
    expect(screen.getByRole('button', { name: /Now/i })).toBeInTheDocument()
  })

  it('now button sets timestamp', () => {
    render(<TimestampConverter />)
    const nowButton = screen.getByRole('button', { name: /Now/i })
    fireEvent.click(nowButton)
    const input = screen.getByPlaceholderText(/1609459200000/i)
    expect(input.value).toMatch(/^\d+$/)
  })
})
