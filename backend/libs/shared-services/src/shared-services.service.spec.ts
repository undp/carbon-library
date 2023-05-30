import { Test, TestingModule } from '@nestjs/testing';
import { SharedServicesService } from './shared-services.service';

describe('SharedServicesService', () => {
  let service: SharedServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedServicesService],
    }).compile();

    service = module.get<SharedServicesService>(SharedServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
