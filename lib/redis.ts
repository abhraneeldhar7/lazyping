import Redis from 'ioredis';

const redisClientSingleton = () => {
    const client = new Redis({
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
        username: process.env.REDIS_USERNAME!,
        password: process.env.REDIS_PASSWORD!,

        maxRetriesPerRequest: 3,
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryStrategy(times) {
            const delay = Math.min(times * 100, 2000);
            return delay;
        },
    });

    client.on('error', (err) => {
        console.error('Redis Client Error', err);
    });

    return client;
};

declare global {
    var redis: undefined | ReturnType<typeof redisClientSingleton>;
}

const redis = globalThis.redis ?? redisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis;

