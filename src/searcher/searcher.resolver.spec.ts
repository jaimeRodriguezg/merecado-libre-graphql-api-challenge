import { Test, TestingModule } from '@nestjs/testing';
import { SearcherResolver } from './searcher.resolver';
import { SearcherService } from './searcher.service';
import { CommonModule } from '../common/common.module';
import { HttpModule } from '@nestjs/axios';

describe('SearcherResolver', () => {
  let resolver: SearcherResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CommonModule],
      providers: [SearcherResolver, SearcherService],
    }).compile();

    resolver = module.get<SearcherResolver>(SearcherResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
