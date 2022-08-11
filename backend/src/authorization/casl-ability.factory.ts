import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Action } from './types/action.enum';

type Subjects = InferSubjects<User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  public createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user) {
      can(Action.Manage, 'all');
    } else {
      cannot(Action.Manage, 'all');
    }

    return build();
  }
}
