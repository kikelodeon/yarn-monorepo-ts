import RedisClient from '../src/RedisClient';

describe('RedisClient', () => {
  const redisClient = new RedisClient();

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

  it('should handle fallback mode when Redis is unavailable', async () => {
    await redisClient.disconnect(); // Simulate Redis being down
    const value = await redisClient.get('missingKey');
    expect(value).toBeNull(); // Fallback to null
  });
});
