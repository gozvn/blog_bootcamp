import Redis from 'ioredis';

export const redisCache = new Redis({
    host: process.env.REDIS_CACHE_HOST,
    port: Number(process.env.REDIS_CACHE_PORT),
    db: Number(process.env.REDIS_CACHE_DB),
});

redisCache.on('connect', () => console.log('✅ Redis cache connected'));
redisCache.on('error', (e) => console.error('❌ Redis error', e));

/**
 * Xoá cache theo prefix (an toàn cho production)
 * @param {string} prefix - ví dụ 'post:list:'
 */
export const deleteCacheByPrefix = async (prefix) => {
    try {
        const stream = redisCache.scanStream({
            match: `${prefix}*`,
            count: 200,
        });

        let totalDeleted = 0;

        for await (const keys of stream) {
            if (keys.length) {
                await redisCache.del(...keys); // spread để tránh lỗi array
                totalDeleted += keys.length;
            }
        }

        console.log(`🧹 Deleted ${totalDeleted} cache keys with prefix "${prefix}"`);
    } catch (err) {
        console.error('❌ deleteCacheByPrefix error:', err);
    }
};