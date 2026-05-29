import { MAX_JSON_SIZE } from './constants'

export function formatJson(input, indent = 2) {
  if (!input || !input.trim()) {
    return { formatted: '', error: null }
  }
  
  if (input.length > MAX_JSON_SIZE) {
    return { 
      formatted: null, 
      error: `JSON too large. Maximum size: ${MAX_JSON_SIZE / 1024 / 1024}MB` 
    }
  }
  
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, indent)
    return { formatted, error: null }
  } catch (e) {
    return { formatted: null, error: e.message }
  }
}

export function minifyJson(input) {
  if (!input || !input.trim()) {
    return { minified: '', error: null }
  }
  
  if (input.length > MAX_JSON_SIZE) {
    return { 
      minified: null, 
      error: `JSON too large. Maximum size: ${MAX_JSON_SIZE / 1024 / 1024}MB` 
    }
  }
  
  try {
    const parsed = JSON.parse(input)
    const minified = JSON.stringify(parsed)
    return { minified, error: null }
  } catch (e) {
    return { minified: null, error: e.message }
  }
}

export function validateJson(input) {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Empty input' }
  }
  
  if (input.length > MAX_JSON_SIZE) {
    return { 
      valid: false, 
      error: `JSON too large. Maximum size: ${MAX_JSON_SIZE / 1024 / 1024}MB` 
    }
  }
  
  try {
    JSON.parse(input)
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e.message }
  }
}
