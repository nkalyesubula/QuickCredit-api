import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  user: process.env.DATABASE_ROOT, 
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD, 
  port: process.env.DATABASE_PORT
 
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
});

export default pool;