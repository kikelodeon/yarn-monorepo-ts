import {RedisClient} from '../src/RedisClient';

describe('RedisClient', () => {
  let redisClient: RedisClient;

  beforeAll(async () => {
    redisClient = new RedisClient({
      host: '127.0.0.1',
      port: 6379,
      password: 'mama-redis-1234', // Add password if required
    });
    await redisClient.connect();
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  it('should connect to Redis successfully', async () => {
    const health = await redisClient.healthCheck();
    expect(health.status).toBe('UP');
  });

  it('should set and get values', async () => {
    await redisClient.set('testKey', 'testValue');
    const value = await redisClient.get('testKey');
    expect(value).toBe('testValue');
  });
});
