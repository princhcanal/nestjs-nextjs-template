import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { ActiveProfiles } from '../active-profiles/decorators/active-profiles.decorator';
import { Profiles } from '../active-profiles/types/profiles';
import { E2EService } from './e2e.service';

@ApiExcludeController()
@Controller(E2EController.API_PATH_E2E)
export class E2EController {
  public static readonly API_PATH_E2E = '/e2e';
  public static readonly RESET_TEST_DATA = 'reset-test-data';

  constructor(private readonly e2eService: E2EService) {}

  @Public()
  @ActiveProfiles(Profiles.E2E)
  @HttpCode(HttpStatus.OK)
  @Post(E2EController.RESET_TEST_DATA)
  public async resetTestData(): Promise<void> {
    return this.e2eService.resetTestData();
  }
}
