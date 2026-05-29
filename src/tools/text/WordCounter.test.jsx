import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WordCounter from './WordCounter'

describe('WordCounter', () => {
  beforeEach(() => {
    render(<WordCounter />)
  })

  it('renders with title and description', () => {
    expect(screen.getByText('Word Counter')).toBeInTheDocument()
    expect(screen.getByText('Word Counter')).toBeInTheDocument()
  })

  it('shows initial stats with empty input', () => {
    const wordsStat = screen.getByText('Words').previousSibling
    expect(wordsStat).toHaveTextContent('0')
  })

  it('counts words correctly', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    fireEvent.change(textarea, { target: { value: 'hello world test' } })

    const wordsStat = screen.getByText('Words').previousSibling
    expect(wordsStat).toHaveTextContent('3')
  })

  it('counts characters correctly', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    fireEvent.change(textarea, { target: { value: 'hello' } })

    const charsStat = screen.getByText('Characters').previousSibling
    expect(charsStat).toHaveTextContent('5')
  })

  it('counts characters without spaces', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    fireEvent.change(textarea, { target: { value: 'hello world' } })

    const noSpacesStat = screen.getByText('No Spaces').previousSibling
    expect(noSpacesStat).toHaveTextContent('10')
  })

  it('counts sentences correctly', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    fireEvent.change(textarea, { target: { value: 'Hello. World! Test?' } })

    const sentencesStat = screen.getByText('Sentences').previousSibling
    expect(sentencesStat).toHaveTextContent('3')
  })

  it('counts paragraphs correctly', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    fireEvent.change(textarea, { target: { value: 'Para 1\n\nPara 2\n\nPara 3' } })

    const paragraphsStat = screen.getByText('Paragraphs').previousSibling
    expect(paragraphsStat).toHaveTextContent('3')
  })

  it('counts lines correctly', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    fireEvent.change(textarea, { target: { value: 'line1\nline2\nline3' } })

    const linesStat = screen.getByText('Lines').previousSibling
    expect(linesStat).toHaveTextContent('3')
  })

  it('calculates reading time', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    const longText = Array(400).fill('word').join(' ')
    fireEvent.change(textarea, { target: { value: longText } })

    const readingTimeStat = screen.getByText('Min Read').previousSibling
    expect(readingTimeStat).toHaveTextContent('2')
  })

  it('clear button resets text and stats', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    const clearButton = screen.getByRole('button', { name: /clear/i })

    fireEvent.change(textarea, { target: { value: 'hello world' } })
    fireEvent.click(clearButton)

    expect(textarea.value).toBe('')
    const wordsStat = screen.getByText('Words').previousSibling
    expect(wordsStat).toHaveTextContent('0')
  })

  it('updates stats in real-time', () => {
    const textarea = screen.getByPlaceholderText(/Start typing or paste/i)
    
    fireEvent.change(textarea, { target: { value: 'one' } })
    const wordsStat1 = screen.getByText('Words').previousSibling
    expect(wordsStat1).toHaveTextContent('1')

    fireEvent.change(textarea, { target: { value: 'one two three' } })
    const wordsStat2 = screen.getByText('Words').previousSibling
    expect(wordsStat2).toHaveTextContent('3')
  })
})
