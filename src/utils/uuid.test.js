import { describe, it, expect } from 'vitest'
import { generateUuid, generateUuids } from './uuid'

describe('generateUuid', () => {
  it('generates valid UUID v4', () => {
    const uuid = generateUuid()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('generates uppercase UUID', () => {
    const uuid = generateUuid({ uppercase: true })
    expect(uuid).toBe(uuid.toUpperCase())
    expect(uuid).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/)
  })

  it('generates UUID without dashes', () => {
    const uuid = generateUuid({ noDashes: true })
    expect(uuid).not.toContain('-')
    expect(uuid.length).toBe(32)
  })

  it('generates uppercase UUID without dashes', () => {
    const uuid = generateUuid({ uppercase: true, noDashes: true })
    expect(uuid).not.toContain('-')
    expect(uuid).toBe(uuid.toUpperCase())
    expect(uuid.length).toBe(32)
  })

  it('generates unique UUIDs', () => {
    const uuid1 = generateUuid()
    const uuid2 = generateUuid()
    expect(uuid1).not.toBe(uuid2)
  })
})

describe('generateUuids', () => {
  it('generates multiple UUIDs', () => {
    const uuids = generateUuids(5)
    expect(uuids).toHaveLength(5)
  })

  it('generates unique UUIDs', () => {
    const uuids = generateUuids(10)
    expect(new Set(uuids).size).toBe(10)
  })

  it('applies options to all UUIDs', () => {
    const uuids = generateUuids(3, { uppercase: true, noDashes: true })
    uuids.forEach(uuid => {
      expect(uuid).toBe(uuid.toUpperCase())
      expect(uuid).not.toContain('-')
      expect(uuid.length).toBe(32)
    })
  })

  it('generates 100 UUIDs', () => {
    const uuids = generateUuids(100)
    expect(uuids).toHaveLength(100)
    expect(new Set(uuids).size).toBe(100)
  })
})
