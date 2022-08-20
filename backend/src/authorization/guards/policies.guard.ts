import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../../authentication/types/request-with-user.interface';
import { CaslAbilityFactory, AppAbility } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../check-policies.decorator';
import { PolicyHandler } from '../types/policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || [];

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability)
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}
