import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JwtDecoder from './JwtDecoder'

describe('JwtDecoder', () => {
  it('renders with title', () => {
    render(<JwtDecoder />)
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument()
  })

  it('has token textarea', () => {
    render(<JwtDecoder />)
    expect(screen.getByPlaceholderText(/Paste your JWT/i)).toBeInTheDocument()
  })

  it('has decode, sample, and clear buttons', () => {
    render(<JwtDecoder />)
    expect(screen.getByRole('button', { name: /Decode/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Load Sample/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('load sample button fills token', () => {
    render(<JwtDecoder />)
    const sampleButton = screen.getByRole('button', { name: /Load Sample/i })
    fireEvent.click(sampleButton)
    const tokenInput = screen.getByPlaceholderText(/Paste your JWT/i)
    expect(tokenInput.value).toContain('eyJ')
  })

  it('shows error for invalid JWT', () => {
    render(<JwtDecoder />)
    const tokenInput = screen.getByPlaceholderText(/Paste your JWT/i)
    fireEvent.change(tokenInput, { target: { value: 'invalid' } })
    const decodeButton = screen.getByRole('button', { name: /Decode/i })
    fireEvent.click(decodeButton)
    expect(screen.getByText(/Invalid JWT format/i)).toBeInTheDocument()
  })
})
