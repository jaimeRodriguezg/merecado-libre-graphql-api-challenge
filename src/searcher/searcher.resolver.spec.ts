import { Test, TestingModule } from '@nestjs/testing';
import { SearcherResolver } from './searcher.resolver';
import { SearcherService } from './searcher.service';

describe('SearcherResolver', () => {
  let resolver: SearcherResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearcherResolver, SearcherService],
    }).compile();

    resolver = module.get<SearcherResolver>(SearcherResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
