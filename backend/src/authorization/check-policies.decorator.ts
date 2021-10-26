import { SetMetadata, Type } from '@nestjs/common';
import { IPolicyHandler } from './types/policy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: Type<IPolicyHandler>[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
