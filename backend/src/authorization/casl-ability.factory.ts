import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Action } from './types/action.enum';

export type AppSubjects = Subjects<{ User: User }> | 'all';

export type AppAbility = PureAbility<[Action, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  public createForUser(user: User | undefined) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility
    );

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
