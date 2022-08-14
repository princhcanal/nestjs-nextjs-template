import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariableKeys } from '../../shared/constants/environment-variable-keys';
import { Profiles } from './types/profiles';

@Injectable()
export class ActiveProfilesService {
  constructor(private readonly configService: ConfigService) {}

  public isTestProfileActive(): boolean {
    return this.isProfileActive(Profiles.TEST);
  }

  public isTestDataProfileActive(): boolean {
    return this.isProfileActive(Profiles.TEST_DATA);
  }

  public isE2EProfileActive(): boolean {
    return this.isProfileActive(Profiles.E2E);
  }

  public isProdProfileActive(): boolean {
    return this.isProfileActive(Profiles.PROD);
  }

  public isProfileActive(profile: Profiles): boolean {
    const profiles: Profiles[] = this.configService
      .get(EnvironmentVariableKeys.ACTIVE_PROFILES)
      ?.split(',');

    return profiles && profiles.some((p) => p === profile);
  }
}
