type Bucket = { count: number; resetAt: number }

const ipBuckets = new Map<string, Bucket>()
const keyBuckets = new Map<string, Bucket>()

function take(map: Map<string, Bucket>, key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const b = map.get(key)
  if (!b || now > b.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }
  if (b.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt }
  }
  b.count += 1
  return { allowed: true, remaining: limit - b.count, resetAt: b.resetAt }
}

export function rateLimitIP(ip: string, limit: number, windowMs: number) {
  return take(ipBuckets, ip, limit, windowMs)
}

export function rateLimitKey(key: string, limit: number, windowMs: number) {
  return take(keyBuckets, key, limit, windowMs)
}


