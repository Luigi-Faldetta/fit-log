/**
 * Test Setup and Global Mocks
 */

// Mock environment variables BEFORE any modules are loaded
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/fitlog_test';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.CLERK_SECRET_KEY = 'test-clerk-key';

// Mock Sequelize to avoid database connections during tests
jest.mock('../models/db.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  // Create comprehensive DataTypes mock
  const DataTypesMock = {
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    STRING: 'STRING',
    TEXT: 'TEXT',
    BOOLEAN: 'BOOLEAN',
    FLOAT: 'FLOAT',
    DOUBLE: 'DOUBLE',
    DECIMAL: 'DECIMAL',
    DATE: 'DATE',
    DATEONLY: 'DATEONLY',
    TIME: 'TIME',
    UUID: 'UUID',
    UUIDV4: 'UUIDV4',
    JSON: 'JSON',
    JSONB: 'JSONB',
    ARRAY: 'ARRAY',
    ENUM: 'ENUM',
  };

  return {
    sequelize: dbMock,
    Sequelize: SequelizeMock,
    DataTypes: DataTypesMock
  };
});

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
  // Close any open connections
  await new Promise(resolve => setTimeout(resolve, 500));
});
