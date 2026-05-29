import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ImageToText from './ImageToText'

vi.mock('../../components/FileDropZone', () => ({
  __esModule: true,
  default: ({ onFileSelect }) => (
    <div>
      <input
        type="file"
        data-testid="file-input"
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
      <span>Drop zone</span>
    </div>
  ),
}))

vi.mock('../../utils/ocr', () => ({
  extractTextFromImage: vi.fn(),
  validateImageFile: vi.fn((file) => ({ valid: true, error: null })),
}))

describe('ImageToText', () => {
  it('renders with title', () => {
    render(<ImageToText />)
    expect(screen.getByText('Image to Text (OCR)')).toBeInTheDocument()
  })

  it('shows file drop zone', () => {
    render(<ImageToText />)
    expect(screen.getByText('Drop zone')).toBeInTheDocument()
  })

  it('clear button is present', () => {
    render(<ImageToText />)
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
  })

  it('extract button is disabled without file', () => {
    render(<ImageToText />)
    const processButton = screen.getByRole('button', { name: /Extract Text/i })
    expect(processButton).toBeDisabled()
  })

  it('displays extracted text after processing', async () => {
    const { extractTextFromImage } = await import('../../utils/ocr')
    extractTextFromImage.mockResolvedValue({ text: 'Hello World', confidence: 95.5 })

    render(<ImageToText />)
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    const processButton = screen.getByRole('button', { name: /Extract Text/i })
    fireEvent.click(processButton)

    const output = await screen.findByPlaceholderText(/Extracted text will appear/i)
    expect(output.value).toBe('Hello World')
  })

  it('shows error message when OCR fails', async () => {
    const { extractTextFromImage } = await import('../../utils/ocr')
    extractTextFromImage.mockRejectedValue(new Error('Network error'))

    render(<ImageToText />)
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    const processButton = screen.getByRole('button', { name: /Extract Text/i })
    fireEvent.click(processButton)

    const errorMessage = await screen.findByText(/Network error/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('clear button resets output', async () => {
    const { extractTextFromImage } = await import('../../utils/ocr')
    extractTextFromImage.mockResolvedValue({ text: 'Hello World', confidence: 95 })

    render(<ImageToText />)
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    const processButton = screen.getByRole('button', { name: /Extract Text/i })
    fireEvent.click(processButton)

    await screen.findByPlaceholderText(/Extracted text will appear/i)

    const clearButton = screen.getByRole('button', { name: /Clear/i })
    fireEvent.click(clearButton)

    expect(screen.queryByPlaceholderText(/Extracted text will appear/i)).not.toBeInTheDocument()
  })

  it('shows confidence score', async () => {
    const { extractTextFromImage } = await import('../../utils/ocr')
    extractTextFromImage.mockResolvedValue({ text: 'Test', confidence: 87.3 })

    render(<ImageToText />)
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })

    const processButton = screen.getByRole('button', { name: /Extract Text/i })
    fireEvent.click(processButton)

    expect(await screen.findByText(/Confidence:/i)).toBeInTheDocument()
    expect(screen.getByText(/87.3%/)).toBeInTheDocument()
  })
})
