import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ActiveProfilesService } from '../active-profiles.service';
import { ACTIVE_PROFILES_KEY } from '../decorators/active-profiles.decorator';
import { Profiles } from '../types/profiles';

export class ActiveProfilesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly activeProfilesService: ActiveProfilesService
  ) {}

  public canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const profiles = this.reflector.get<Profiles | Profiles[] | undefined>(
      ACTIVE_PROFILES_KEY,
      context.getHandler()
    );

    if (!profiles) {
      return true;
    }

    if (Array.isArray(profiles)) {
      return profiles.every((p) =>
        this.activeProfilesService.isProfileActive(p)
      );
    } else {
      return this.activeProfilesService.isProfileActive(profiles);
    }
  }
}
