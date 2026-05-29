export function timestampToDate(timestamp) {
  if (timestamp > 1e12) {
    return new Date(timestamp)
  }
  return new Date(timestamp * 1000)
}

export function dateToTimestamp(date) {
  return Math.floor(date.getTime() / 1000)
}

export function dateToMsTimestamp(date) {
  return date.getTime()
}

export function relativeTime(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 0) {
    const absSeconds = Math.abs(seconds)
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ]
    
    for (const interval of intervals) {
      const count = Math.floor(absSeconds / interval.seconds)
      if (count >= 1) {
        return `in ${count} ${interval.label}${count > 1 ? 's' : ''}`
      }
    }
    return 'in a moment'
  }
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  
  return 'just now'
}

export function formatInTimezone(date, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date)
}
