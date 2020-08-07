module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://dunder_mifflin:2@localhost/foodora',
  API_TOKEN: process.env.API_TOKEN,
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret',
};
