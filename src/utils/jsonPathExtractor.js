import { JSONPath } from 'jsonpath-plus'
import { MAX_JSON_PATH_SIZE } from './constants'

function validatePath(path) {
  if (!path.startsWith('$')) {
    return 'Path must start with $'
  }
  let bracketDepth = 0
  for (let i = 0; i < path.length; i++) {
    if (path[i] === '[') bracketDepth++
    else if (path[i] === ']') {
      if (bracketDepth === 0) return 'Unmatched ] bracket'
      bracketDepth--
    }
  }
  if (bracketDepth > 0) return 'Unmatched [ bracket'
  return null
}

export function extractJsonPath(json, path) {
  if (!json || !json.trim()) {
    return { result: null, error: 'No input provided' }
  }

  if (!path || !path.trim()) {
    return { result: null, error: 'No path expression provided' }
  }

  if (json.length > MAX_JSON_PATH_SIZE) {
    return {
      result: null,
      error: `JSON too large. Maximum size: ${MAX_JSON_PATH_SIZE / 1024 / 1024}MB`,
    }
  }

  const pathError = validatePath(path.trim())
  if (pathError) {
    return { result: null, error: pathError }
  }

  try {
    const parsed = JSON.parse(json)
    const result = JSONPath({ path, json: parsed, wrap: false })
    return { result, error: null }
  } catch (e) {
    return { result: null, error: e.message }
  }
}
