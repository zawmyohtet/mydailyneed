import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RegexTester from './RegexTester'

describe('RegexTester', () => {
  it('renders with title', () => {
    render(<RegexTester />)
    expect(screen.getByText('Regex Tester')).toBeInTheDocument()
  })

  it('has pattern input', () => {
    render(<RegexTester />)
    expect(screen.getByPlaceholderText(/e.g.,/i)).toBeInTheDocument()
  })

  it('has flags input defaulting to g', () => {
    render(<RegexTester />)
    const flagsInput = screen.getByPlaceholderText('flags')
    expect(flagsInput).toBeInTheDocument()
    expect(flagsInput.value).toBe('g')
  })

  it('has test string textarea', () => {
    render(<RegexTester />)
    expect(screen.getByPlaceholderText(/Enter text to test/i)).toBeInTheDocument()
  })

  it('has test and clear buttons', () => {
    render(<RegexTester />)
    expect(screen.getByRole('button', { name: /Test/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('finds matches with valid regex', () => {
    render(<RegexTester />)
    const patternInput = screen.getByPlaceholderText(/e.g.,/i)
    fireEvent.change(patternInput, { target: { value: '\\d+' } })
    const testString = screen.getByPlaceholderText(/Enter text to test/i)
    fireEvent.change(testString, { target: { value: 'abc123' } })
    const testButton = screen.getByRole('button', { name: /Test/i })
    fireEvent.click(testButton)
    expect(screen.getByText('Valid Pattern')).toBeInTheDocument()
  })

  it('shows error for invalid regex', () => {
    render(<RegexTester />)
    const patternInput = screen.getByPlaceholderText(/e.g.,/i)
    fireEvent.change(patternInput, { target: { value: '[invalid' } })
    const testString = screen.getByPlaceholderText(/Enter text to test/i)
    fireEvent.change(testString, { target: { value: 'test' } })
    const testButton = screen.getByRole('button', { name: /Test/i })
    fireEvent.click(testButton)
    expect(screen.getByText('Invalid Pattern')).toBeInTheDocument()
  })
})
