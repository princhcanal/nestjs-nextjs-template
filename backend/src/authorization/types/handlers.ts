import { AppAbility } from '../casl-ability.factory';
import { Action } from './action.enum';

export const Handlers = {
  CanManageAll: (ability: AppAbility) => ability.can(Action.Manage, 'all'),
  CanManageUsers: (ability: AppAbility) => ability.can(Action.Manage, 'User'),
  CanReadUsers: (ability: AppAbility) => ability.can(Action.Read, 'User'),
  CanUpdateUsers: (ability: AppAbility) => ability.can(Action.Update, 'User'),
  CanCreateUsers: (ability: AppAbility) => ability.can(Action.Create, 'User'),
  CanDeleteUsers: (ability: AppAbility) => ability.can(Action.Delete, 'User'),
};
