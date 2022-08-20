import { Module } from '@nestjs/common';
import { appModule } from './shared/app-module';

@Module(appModule)
export class AppModule {}
