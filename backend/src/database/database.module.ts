import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvironmentVariableKeys } from '../config/environment-variable-keys';

const ssl = {
  rejectUnauthorized: false,
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService
          .get(EnvironmentVariableKeys.DATABASE_URL)
          .replace('postgres://', '');

        const [username, passwordAndHost, portAndDatabase] =
          databaseUrl.split(':');
        const [password, host] = passwordAndHost.split('@');
        const [port, database] = portAndDatabase.split('/');

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          ssl: process.env.NODE_ENV === 'production' && ssl,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
