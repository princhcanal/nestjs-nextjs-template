import { Global, Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';

@Global()
@Module({
  providers: [
    CaslAbilityFactory,
    {
      provide: APP_GUARD,
      useFactory: (
        reflector: Reflector,
        caslAbilityFactory: CaslAbilityFactory
      ) => {
        return new PoliciesGuard(reflector, caslAbilityFactory);
      },
      inject: [Reflector, CaslAbilityFactory],
    },
  ],
  exports: [CaslAbilityFactory],
})
export class AuthorizationModule {}
