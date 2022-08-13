import { Global, Module } from '@nestjs/common';
import { ActiveProfilesService } from './active-profiles.service';

@Global()
@Module({
  providers: [ActiveProfilesService],
  exports: [ActiveProfilesService],
})
export class ActiveProfilesModule {}
