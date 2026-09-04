import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, resetRateLimit, RATE_LIMIT_POLICIES } from '../src/lib/rate-limiter'

describe('Sliding Window Rate Limiter Engine', () => {
  const testIp = '192.168.1.100'

  beforeEach(() => {
    resetRateLimit(testIp)
  })

  it('should allow requests within the specified limit', () => {
    const policy = { windowMs: 1000, maxRequests: 3 }

    const res1 = checkRateLimit(testIp, policy)
    expect(res1.success).toBe(true)
    expect(res1.remaining).toBe(2)

    const res2 = checkRateLimit(testIp, policy)
    expect(res2.success).toBe(true)
    expect(res2.remaining).toBe(1)

    const res3 = checkRateLimit(testIp, policy)
    expect(res3.success).toBe(true)
    expect(res3.remaining).toBe(0)
  })

  it('should block requests when limit is exceeded and return retry-after', () => {
    const policy = { windowMs: 2000, maxRequests: 2 }

    checkRateLimit(testIp, policy) // 1st
    checkRateLimit(testIp, policy) // 2nd

    // 3rd should be blocked
    const blockedRes = checkRateLimit(testIp, policy)
    expect(blockedRes.success).toBe(false)
    expect(blockedRes.remaining).toBe(0)
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('should support resetting rate limit after identifier unblock', () => {
    const policy = { windowMs: 1000, maxRequests: 1 }

    checkRateLimit(testIp, policy)
    const blocked = checkRateLimit(testIp, policy)
    expect(blocked.success).toBe(false)

    resetRateLimit(testIp)

    const afterReset = checkRateLimit(testIp, policy)
    expect(afterReset.success).toBe(true)
  })

  it('should enforce strict presets for AUTH policy', () => {
    expect(RATE_LIMIT_POLICIES.AUTH.maxRequests).toBe(10)
    expect(RATE_LIMIT_POLICIES.AUTH.windowMs).toBe(60000)
  })
})
