import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const databaseUrl = process.env.DATABASE_URL.replace('postgres://', '');

const [username, passwordAndHost, portAndDatabase] = databaseUrl.split(':');
const [password, host] = passwordAndHost.split('@');
const [port, database] = portAndDatabase.split('/');

const ssl = {
  rejectUnauthorized: false,
};

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host,
  port: +port,
  username,
  password,
  database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../database/migrations',
  },
  ssl: process.env.NODE_ENV === 'production' && ssl,
  namingStrategy: new SnakeNamingStrategy(),
};

export = config;
