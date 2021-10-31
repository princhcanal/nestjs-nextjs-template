import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../../src/authorization/casl-ability.factory';

@Global()
@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class MockAuthorizationModule {}
