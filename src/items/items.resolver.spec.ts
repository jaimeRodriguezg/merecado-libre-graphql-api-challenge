import { Test, TestingModule } from '@nestjs/testing';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '../common/common.module';

describe('ItemsResolver', () => {
  let resolver: ItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CommonModule],
      providers: [ItemsResolver, ItemsService],
    }).compile();

    resolver = module.get<ItemsResolver>(ItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
