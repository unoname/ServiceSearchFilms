import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const password = process.env.PASSWORD_PGSQL;
const host = process.env.HOST || 'localhost';

const pool = new pg.Pool({
  user: 'postgres',
  host: host,
  database: 'db_homework',
  password: password,
  port: 5432,  
});

export default pool;
