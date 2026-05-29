import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import FileDropZone from '../../components/FileDropZone'
import { extractTextFromImage, validateImageFile } from '../../utils/ocr'
import { OCR_LANGUAGES } from '../../utils/constants'

export default function ImageToText() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [output, setOutput] = useState('')
  const [confidence, setConfidence] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState('eng')

  const handleFileSelect = async (selectedFile) => {
    setError(null)
    setOutput('')
    setConfidence(null)
    setProgress(0)
    
    const validation = validateImageFile(selectedFile)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setFile(selectedFile)
    
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleProcess = async () => {
    if (!file) {
      setError('Please select an image first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setOutput('')
    setConfidence(null)
    setProgress(0)

    try {
      console.log('Starting OCR process with language:', language)
      const result = await extractTextFromImage(file, setProgress, language)
      console.log('OCR result:', result)
      setOutput(result.text)
      setConfidence(result.confidence)
    } catch (e) {
      console.error('OCR error:', e)
      setError(e.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setOutput('')
    setConfidence(null)
    setProgress(0)
    setError(null)
    setIsProcessing(false)
  }

  return (
    <ToolLayout
      title="Image to Text (OCR)"
      icon={["fas", "image"]}
      description="Extract text from images using OCR technology powered by Tesseract.js"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="ocr-language" className="text-sm font-medium">Language:</label>
            <select
              id="ocr-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            >
              {OCR_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FileDropZone
          onFileSelect={handleFileSelect}
          acceptedTypes="image/*"
          maxSize={5 * 1024 * 1024}
          label="Drop an image here or click to select"
        />

        {preview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </label>
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-64 rounded-lg border border-gray-300"
              />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleProcess}
            data-action="run"
            disabled={!file || isProcessing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Extract Text'}
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear
          </button>
        </div>

        {isProcessing && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                Extracted Text
              </label>
              {confidence !== null && (
                <span className="text-sm text-gray-600">
                  Confidence: {confidence.toFixed(1)}%
                </span>
              )}
            </div>
            <div className="relative">
              <textarea
                id="output"
                value={output}
                readOnly
                placeholder="Extracted text will appear here..."
                className="w-full h-48 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
              />
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
