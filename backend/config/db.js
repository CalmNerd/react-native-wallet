import {neon} from '@neondatabase/serverless';
import "dotenv/config";

//creates a connection to the Neon database using the DATABASE_URL from environment variables
// and exports the sql object for use in other parts of the application.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}
export const sql = neon(process.env.DATABASE_URL);