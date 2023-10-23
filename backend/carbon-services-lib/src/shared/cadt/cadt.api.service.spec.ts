import { Test, TestingModule } from '@nestjs/testing';
import { CadtApiService } from './cadt.api.service';

describe('CadtApiService', () => {
  let service: CadtApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CadtApiService],
    }).compile();

    service = module.get<CadtApiService>(CadtApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
