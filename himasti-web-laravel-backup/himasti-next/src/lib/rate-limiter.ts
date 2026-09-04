/**
 * HIMASTI High-Performance Sliding Window Rate Limiter
 * Proteksi anti-DDoS, brute-force login, dan spam API.
 * Menggunakan memori efisien dengan TTL otomatis (Zero memory leak).
 */

export interface RateLimitPolicy {
  windowMs: number // Jendela waktu dalam milidetik (contoh: 60000 = 1 menit)
  maxRequests: number // Maksimum permintaan yang diizinkan dalam jendela waktu tersebut
}

// Preset kebijakan keamanan
export const RATE_LIMIT_POLICIES = {
  // Rute sensitif login / register / webauthn: 10 request / menit
  AUTH: {
    windowMs: 60 * 1000,
    maxRequests: 10,
  },
  // Rute AI (Groq & Gemini Chatbot / Prompt Optimizer): 20 request / menit
  AI: {
    windowMs: 60 * 1000,
    maxRequests: 20,
  },
  // API endpoints umum (Data fetching / mutation): 80 request / menit
  API: {
    windowMs: 60 * 1000,
    maxRequests: 80,
  },
  // Global browsing: 240 request / menit
  GLOBAL: {
    windowMs: 60 * 1000,
    maxRequests: 240,
  },
} as const

interface RateLimitEntry {
  timestamps: number[]
  lastUpdated: number
}

// In-memory store
const ipStore = new Map<string, RateLimitEntry>()

// Interval pembersihan otomatis setiap 2 menit untuk mencegah memory leak
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 2 * 60 * 1000

function purgeExpiredEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  const maxTTL = 5 * 60 * 1000 // 5 menit

  for (const [key, entry] of ipStore.entries()) {
    if (now - entry.lastUpdated > maxTTL) {
      ipStore.delete(key)
    }
  }
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfterSeconds: number
}

/**
 * Mengecek dan mencatat request berdasarkan identifier (misal: IP address)
 */
export function checkRateLimit(
  identifier: string,
  policy: RateLimitPolicy = RATE_LIMIT_POLICIES.GLOBAL
): RateLimitResult {
  purgeExpiredEntries()

  const now = Date.now()
  const windowStart = now - policy.windowMs

  let entry = ipStore.get(identifier)

  if (!entry) {
    entry = {
      timestamps: [now],
      lastUpdated: now,
    }
    ipStore.set(identifier, entry)
    return {
      success: true,
      limit: policy.maxRequests,
      remaining: policy.maxRequests - 1,
      resetTime: now + policy.windowMs,
      retryAfterSeconds: 0,
    }
  }

  // Filter timestamps yang masih berada di dalam jendela waktu geser (sliding window)
  const validTimestamps = entry.timestamps.filter((ts) => ts > windowStart)

  if (validTimestamps.length >= policy.maxRequests) {
    // Terlalu banyak request
    const oldestTimestamp = validTimestamps[0]
    const resetTime = oldestTimestamp + policy.windowMs
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000))

    return {
      success: false,
      limit: policy.maxRequests,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    }
  }

  // Tambahkan timestamp baru
  validTimestamps.push(now)
  entry.timestamps = validTimestamps
  entry.lastUpdated = now
  ipStore.set(identifier, entry)

  return {
    success: true,
    limit: policy.maxRequests,
    remaining: policy.maxRequests - validTimestamps.length,
    resetTime: now + policy.windowMs,
    retryAfterSeconds: 0,
  }
}

/**
 * Reset limit untuk identifier tertentu (misal setelah login berhasil)
 */
export function resetRateLimit(identifier: string): void {
  ipStore.delete(identifier)
}
