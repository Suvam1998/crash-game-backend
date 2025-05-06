// utils/cache.js

const cache = {};

/**
 * Set a cache key with value and expiry time in milliseconds
 */
function setCache(key, value, ttl = 10000) {
  const expiry = Date.now() + ttl;
  cache[key] = { value, expiry };
}

/**
 * Get a cached value by key, returns undefined if expired or missing
 */
function getCache(key) {
  const cached = cache[key];
  if (!cached) return undefined;
  if (Date.now() > cached.expiry) {
    delete cache[key];
    return undefined;
  }
  return cached.value;
}

module.exports = { setCache, getCache };
