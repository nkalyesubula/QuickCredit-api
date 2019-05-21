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

const createTables = () => {

  // users table
  const userTable = `CREATE TABLE IF NOT EXISTS users
                      (   id SERIAL PRIMARY KEY    NOT NULL,
                          firstName         VARCHAR(255)     NOT NULL,
                          lastName          VARCHAR(255)     NOT NULL,
                          email             VARCHAR(255)     NOT NULL,
                          password          VARCHAR(255)     NOT NULL,
                          status VARCHAR(100)  DEFAULT 'unverified',
                          isAdmin           BOOLEAN    NOT NULL           
                          )`;

// loans table
const loanTable = `CREATE TABLE IF NOT EXISTS loans
      (   id SERIAL PRIMARY KEY    NOT NULL,
          userEmail        VARCHAR(255)     NOT NULL,
          tenor        INTEGER   NOT NULL,
          amount       INTEGER   NOT NULL,
          interest     INTEGER   NOT NULL,
          paymentInstallment     INTEGER   NOT NULL,
          balance     INTEGER   NOT NULL,
          repaid   BOOLEAN DEFAULT false,
          status VARCHAR(100)  DEFAULT 'pending',          
          createdOn TIMESTAMP DEFAULT NOW()
          )`;

// repayments table

const loanRepaymentTable = `CREATE TABLE IF NOT EXISTS repayments
      (   id SERIAL PRIMARY KEY    NOT NULL,
          userId       INTEGER     NOT NULL,
          amount       INTEGER   NOT NULL,
          loanId     INTEGER   NOT NULL,         
          createdOn     DATE     NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
          FOREIGN KEY (loanId) REFERENCES loans (id)
          ON UPDATE CASCADE ON DELETE CASCADE
        )`;
  const createTablesQuery = `${userTable};${loanTable};${loanRepaymentTable};`;
  pool.query(createTablesQuery)
  .then((res) => {
  console.log(res);
  pool.end();
  })
  .catch((err) => {
  console.log(err);
  pool.end();
  });
}

pool.on('remove', () => {
  process.exit(0);
});


//export pool and createTables to be accessible  from an where within the application
export {
  createTables,
  pool,
};

require('make-runnable');