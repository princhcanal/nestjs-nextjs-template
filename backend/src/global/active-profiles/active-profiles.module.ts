import { Global, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ActiveProfilesService } from './active-profiles.service';
import { ActiveProfilesGuard } from './guards/active-profiles.guard';

@Global()
@Module({
  providers: [
    ActiveProfilesService,
    {
      provide: APP_GUARD,
      useFactory: (
        reflector: Reflector,
        activeProfilesService: ActiveProfilesService
      ) => {
        return new ActiveProfilesGuard(reflector, activeProfilesService);
      },
      inject: [Reflector, ActiveProfilesService],
    },
  ],
  exports: [ActiveProfilesService],
})
export class ActiveProfilesModule {}
