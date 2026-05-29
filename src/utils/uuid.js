export function generateUuid(options = {}) {
  const { uppercase = false, noDashes = false } = options
  
  if (typeof crypto === 'undefined' || !crypto.randomUUID) {
    throw new Error('UUID generation not supported in this browser')
  }
  
  let uuid = crypto.randomUUID()
  
  if (noDashes) {
    uuid = uuid.replace(/-/g, '')
  }
  
  if (uppercase) {
    uuid = uuid.toUpperCase()
  }
  
  return uuid
}

export function generateUuids(count, options = {}) {
  return Array.from({ length: count }, () => generateUuid(options))
}
