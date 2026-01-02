/**
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class WeatherCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private defaultTTL: number

  /**
   * Create a cache with default TTL in seconds
   */
  constructor(defaultTTL: number = 300) {
    this.defaultTTL = defaultTTL * 1000 // Convert to ms
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  /**
   * Set a value in cache with optional custom TTL
   */
  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    })
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove expired entries
   */
  prune(): number {
    const now = Date.now()
    let pruned = 0

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        pruned++
      }
    }

    return pruned
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}
