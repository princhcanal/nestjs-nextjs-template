import { AbilityBuilder, AbilityClass } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Action } from './types/action.enum';

export type AppSubjects = Subjects<{ User: User }> | 'all';

export type AppAbility = PrismaAbility<[Action, AppSubjects]>;
const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  public createForUser(user: User | undefined) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);

    if (!!user) {
      if (user.roles.includes(Role.ADMIN)) {
        can(Action.Manage, 'all');
      } else {
        can(Action.Manage, 'User', { id: user.id });
      }
    } else {
      cannot(Action.Manage, 'all');
    }

    return build();
  }
}
