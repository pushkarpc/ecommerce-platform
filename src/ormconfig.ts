// src/ormconfig.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Parse environmental values from root profile
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The CLI reads this exported instance directly
const cloudDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  // Point to the compiled .js output formats inside the build environment
  entities: [join(__dirname, '/**/*.entity.js')],
  migrations: [join(__dirname, '/migrations/*.js')],

  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
});

export default cloudDataSource;
