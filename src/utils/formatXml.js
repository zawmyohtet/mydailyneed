const MAX_XML_SIZE = 1024 * 1024

const DOCTYPE_RE = /<!DOCTYPE[\s\S]*?>/gi
const ENTITY_RE = /<!ENTITY[\s\S]*?>/gi

function stripDoctype(input) {
  return input.replace(DOCTYPE_RE, '').replace(ENTITY_RE, '')
}

export function formatXml(input, indent = 2) {
  if (!input || !input.trim()) {
    return { formatted: '', error: null }
  }
  
  if (input.length > MAX_XML_SIZE) {
    return {
      formatted: null,
      error: `XML too large. Maximum size: ${MAX_XML_SIZE / 1024 / 1024}MB`
    }
  }
  
  try {
    const sanitized = stripDoctype(input)
    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitized, 'text/xml')
    
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      throw new Error(parseError.textContent)
    }
    
    const formatted = prettyPrint(doc, indent)
    return { formatted, error: null }
  } catch (e) {
    return { formatted: null, error: e.message }
  }
}

export function minifyXml(input, preserveComments = false) {
  if (!input || !input.trim()) {
    return { minified: '', error: null }
  }
  
  if (input.length > MAX_XML_SIZE) {
    return {
      minified: null,
      error: `XML too large. Maximum size: ${MAX_XML_SIZE / 1024 / 1024}MB`
    }
  }
  
  try {
    const sanitized = stripDoctype(input)
    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitized, 'text/xml')
    
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      throw new Error(parseError.textContent)
    }
    
    const minified = serializeWithoutWhitespace(doc, preserveComments)
    return { minified, error: null }
  } catch (e) {
    return { minified: null, error: e.message }
  }
}

export function validateXml(input) {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Empty input' }
  }
  
  if (input.length > MAX_XML_SIZE) {
    return {
      valid: false,
      error: `XML too large. Maximum size: ${MAX_XML_SIZE / 1024 / 1024}MB`
    }
  }
  
  try {
    const sanitized = stripDoctype(input)
    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitized, 'text/xml')
    const parseError = doc.querySelector('parsererror')
    
    if (parseError) {
      return { valid: false, error: parseError.textContent }
    }
    
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e.message }
  }
}

function prettyPrint(node, indent, level = 0) {
  const indentStr = ' '.repeat(indent * level)
  let result = ''
  
  if (node.nodeType === Node.DOCUMENT_NODE) {
    if (node.xmlVersion) {
      result += `<?xml version="${node.xmlVersion}"?>\n`
    }
  }
  
  for (const child of node.childNodes) {
    result += processNode(child, indent, level)
  }
  
  return result.trim()
}

function processNode(node, indent, level) {
  const indentStr = ' '.repeat(indent * level)
  
  if (node.nodeType === Node.ELEMENT_NODE) {
    let result = `${indentStr}<${node.nodeName}`
    
    for (const attr of node.attributes) {
      result += ` ${attr.name}="${attr.value}"`
    }
    
    if (node.childNodes.length === 0) {
      result += '/>\n'
    } else if (node.childNodes.length === 1 && node.firstChild.nodeType === Node.TEXT_NODE) {
      result += `>${node.firstChild.textContent}</${node.nodeName}>\n`
    } else {
      result += '>\n'
      for (const child of node.childNodes) {
        result += processNode(child, indent, level + 1)
      }
      result += `${indentStr}</${node.nodeName}>\n`
    }
    
    return result
  } else if (node.nodeType === Node.COMMENT_NODE) {
    return `${indentStr}<!--${node.textContent}-->\n`
  } else if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim()
    return text ? `${indentStr}${text}\n` : ''
  }
  
  return ''
}

function serializeWithoutWhitespace(node, preserveComments) {
  let result = ''
  
  if (node.nodeType === Node.DOCUMENT_NODE) {
    for (const child of node.childNodes) {
      result += serializeWithoutWhitespace(child, preserveComments)
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    result += `<${node.nodeName}`
    
    for (const attr of node.attributes) {
      result += ` ${attr.name}="${attr.value}"`
    }
    
    if (node.childNodes.length === 0) {
      result += '/>'
    } else {
      result += '>'
      for (const child of node.childNodes) {
        result += serializeWithoutWhitespace(child, preserveComments)
      }
      result += `</${node.nodeName}>`
    }
  } else if (node.nodeType === Node.COMMENT_NODE && preserveComments) {
    result += `<!--${node.textContent}-->`
  } else if (node.nodeType === Node.TEXT_NODE) {
    result += node.textContent.trim()
  }
  
  return result
}
