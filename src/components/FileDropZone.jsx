import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FileDropZone({ accept, onFileSelect, maxSize, label }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateAndSelect = useCallback((file) => {
    setError(null)
    
    if (maxSize && file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      setError(`File size exceeds maximum of ${sizeMB}MB`)
      return
    }
    
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const fileType = file.type
      const fileName = file.name.toLowerCase()
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('image/')) {
          return fileType.startsWith('image/')
        }
        return fileType === type || fileName.endsWith(type.replace('*', ''))
      })
      
      if (!isAccepted) {
        setError(`Unsupported file format. Accepted: ${accept}`)
        return
      }
    }
    
    onFileSelect(file)
  }, [accept, maxSize, onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndSelect(file)
    }
  }, [validateAndSelect])

  const handleChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      validateAndSelect(file)
    }
  }, [validateAndSelect])

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <span className="sr-only">Upload file</span>
          <FontAwesomeIcon 
            icon={['fas', 'cloud-upload-alt']} 
            className="text-4xl text-gray-400 mb-4" 
          />
          <p className="text-gray-600 dark:text-gray-400">
            {label || 'Drag & drop file here or click to upload'}
          </p>
        </label>
      </div>
      
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}
