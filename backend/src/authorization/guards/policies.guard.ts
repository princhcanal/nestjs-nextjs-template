import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { RequestWithUser } from '../../authentication/types/request-with-user.interface';
import { CaslAbilityFactory, AppAbility } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../check-policies.decorator';
import { IPolicyHandler } from '../types/policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly moduleRef: ModuleRef
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const tIPolicyHandlers =
      this.reflector.get<Type<IPolicyHandler>[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || [];

    const policyHandlers = await Promise.all(
      tIPolicyHandlers.map(
        async (policyHandler) => await this.moduleRef.create(policyHandler)
      )
    );

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability)
    );
  }

  private execPolicyHandler(handler: IPolicyHandler, ability: AppAbility) {
    return handler.handle(ability);
  }
}
