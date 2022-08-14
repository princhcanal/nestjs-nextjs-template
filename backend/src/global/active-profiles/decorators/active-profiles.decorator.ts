import { SetMetadata } from '@nestjs/common';
import { Profiles } from '../types/profiles';

export const ACTIVE_PROFILES_KEY = 'active-profiles';
export const ActiveProfiles = (profiles: Profiles | Profiles[]) =>
  SetMetadata(ACTIVE_PROFILES_KEY, profiles);
