import ratelimit from "../config/upstash.js";


// // local way 
// const rateLimiter = async (req, res, next) => {
//     try {
//         const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//         const result = await ratelimit.limit(ip);

//         if (!result.success) {
//             return res.status(429).json({ error: 'Too many requests, please try again later.' });
//         }

//         next();
//     } catch (error) {
//         console.error('Rate limiter error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }


const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // const {success} = await ratelimit.limit("my-rate-limit") //in production, you would use a unique identifier like user ID or IP address
        const { success } = await ratelimit.limit(ip)

        if (!success) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
        }

        next();


    } catch (error) {
        console.error('Rate limiter error:', error);
        return res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
};

export default rateLimiter;