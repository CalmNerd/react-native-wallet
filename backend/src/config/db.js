import {neon} from '@neondatabase/serverless';
import "dotenv/config";

//creates a connection to the Neon database using the DATABASE_URL from environment variables
// and exports the sql object for use in other parts of the application.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE
      )`;

        console.log('Database initialized successfully');
    } catch (error) {
        console.log("Error initializing database:", error);
        process.exit(1); // status code 1 indicates an error
    }

}