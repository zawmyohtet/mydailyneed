import { MAX_OCR_FILE_SIZE, SUPPORTED_IMAGE_FORMATS } from './constants'

export function validateFile(file, options = {}) {
  const {
    maxSize = MAX_OCR_FILE_SIZE,
    allowedTypes = SUPPORTED_IMAGE_FORMATS,
  } = options

  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `File size exceeds maximum of ${sizeMB}MB`,
    }
  }

  const fileType = file.type.toLowerCase()
  
  if (fileType === 'image/svg+xml') {
    return { valid: false, error: 'SVG files are not supported' }
  }
  
  const isAllowed = allowedTypes.some(type => {
    const allowedType = type.toLowerCase()
    return fileType === allowedType || 
           (allowedType.startsWith('image/') && fileType.startsWith('image/'))
  })

  if (!isAllowed) {
    return {
      valid: false,
      error: 'Unsupported file format. Supported: PNG, JPG, JPEG, WEBP, BMP, GIF',
    }
  }

  return { valid: true, error: null }
}

export function validateImageFile(file) {
  return validateFile(file, {
    maxSize: MAX_OCR_FILE_SIZE,
    allowedTypes: SUPPORTED_IMAGE_FORMATS,
  })
}
