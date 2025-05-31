import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit';

import "dotenv/config";

const ratelimit = new Ratelimit({
    //   url: '',
    //   token: '',
    redis: Redis.fromEnv(), // Use environment variables for Upstash Redis connection
    limiter: Ratelimit.slidingWindow(100, "60 s"),
})

// await redis.set('foo', 'bar');
// const data = await redis.get('foo');

export default ratelimit;