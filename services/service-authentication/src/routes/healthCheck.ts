import { PrismaClient, RedisClient, KafkaClient } from '@kikerepo/common-infrastructure';

const HEALTHCHECK_TIMEOUT_MS = parseInt(process.env.HEALTHCHECK_TIMEOUT_MS || '1000', 10);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`healthCheck timed out after ${ms}ms`));
    }, ms);

    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function healthCheck(_req: any, res: any) {
  const checks = [
    { name: 'postgres', fn: withTimeout(PrismaClient.ins.healthCheck(), HEALTHCHECK_TIMEOUT_MS) },
    { name: 'redis',    fn: withTimeout(RedisClient.ins.healthCheck(), HEALTHCHECK_TIMEOUT_MS) },
    { name: 'kafka',    fn: withTimeout(KafkaClient.ins.healthCheck(), HEALTHCHECK_TIMEOUT_MS) },
  ];

  // run them all in parallel, but don’t let one hang forever
  const settled = await Promise.allSettled(checks.map(c => c.fn));

  // build a nice `services` object
  const services = checks.reduce<Record<string, {status:string; message?:string}>>((acc, check, i) => {
    const result = settled[i];
    if (result.status === 'fulfilled') {
      acc[check.name] = result.value;
    } else {
      acc[check.name] = { status: 'DOWN', message: (result.reason as Error).message };
    }
    return acc;
  }, {});

  const allUp = Object.values(services).every(s => s.status === 'UP');
  res.status(allUp ? 200 : 503).json({
    status: allUp ? 'UP' : 'DOWN',
    services,
  });
}
