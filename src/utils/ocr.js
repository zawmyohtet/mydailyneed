const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff']

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return { 
      valid: false, 
      error: `Unsupported format. Supported: ${SUPPORTED_FORMATS.map(t => t.split('/')[1]).join(', ')}` 
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    }
  }

  return { valid: true, error: null }
}

export async function extractTextFromImage(file, onProgress, language = 'eng') {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  try {
    const Tesseract = await import('tesseract.js')
    
    const worker = await Tesseract.createWorker(language, 1, {
      logger: m => {
        console.log('Tesseract progress:', m)
        if (onProgress && m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100))
        }
      }
    })
    
    const result = await worker.recognize(file)
    
    await worker.terminate()

    return { 
      text: result.data.text, 
      confidence: result.data.confidence,
      words: result.data.words 
    }
  } catch (e) {
    console.error('OCR Error:', e)
    const message = e?.message || String(e) || 'Unknown error'
    if (message.includes('Failed to load') || message.includes('worker')) {
      throw new Error('Failed to load OCR engine. Please check your internet connection.')
    }
    throw new Error(`OCR failed: ${message}`)
  }
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
