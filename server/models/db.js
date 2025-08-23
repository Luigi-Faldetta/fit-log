const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Check for DATABASE_URL and provide helpful error
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')));
  throw new Error('DATABASE_URL environment variable is required but not found');
}

console.log('✓ DATABASE_URL found, length:', databaseUrl.length);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  define: {
    noPrimaryKey: true,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
    keepAlive: true,
    statement_timeout: 60000,
    query_timeout: 60000,
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 60000,
  },
  pool: {
    max: 3,
    min: 0,
    acquire: 60000,
    idle: 30000,
    evict: 10000,
    handleDisconnects: true,
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ESOCKETTIMEDOUT/,
      /EHOSTUNREACH/,
      /EPIPE/,
      /EAI_AGAIN/,
      /Connection terminated unexpectedly/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 5,
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      'Connection to the database has been established successfully.'
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = {
  sequelize,
  DataTypes,
};
