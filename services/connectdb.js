import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  user: process.env.DATABASE_ROOT, 
  database: process.env.DATABASE_NAME
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
});

export default pool;