import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
          .get('DATABASE_URL')
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
        };
      },
    }),
  ],
})
export class DatabaseModule {}
