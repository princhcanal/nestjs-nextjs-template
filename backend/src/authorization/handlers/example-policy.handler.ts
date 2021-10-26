import { AppAbility } from '../casl-ability.factory';
import { IPolicyHandler } from '../types/policy-handler.interface';

export class ExamplePolicyHandler implements IPolicyHandler {
  public handle(ability: AppAbility) {
    return true;
  }
}
