import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearcherService } from './searcher.service';
import {
  SearcherResponse,
  SearcherResponsePagination,
} from './entities/searcher.entity';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@Resolver(() => SearcherResponse)
export class SearcherResolver {
  constructor(private readonly searcherService: SearcherService) {}

  @Query(() => SearcherResponse, { name: 'searcher' })
  async searcher(
    @Args('search', { type: () => String }) search: string,
    @Args('name', { type: () => String }) name: string,
    @Args('lastName', { type: () => String }) lastName: string,
  ): Promise<SearcherResponse> {
    return this.searcherService.searcher(search, name, lastName);
  }

  @Query(() => SearcherResponsePagination, {
    name: 'searcherPagination',
    description: 'Search with pagination',
  })
  async searcherPagination(
    @Args('search', { type: () => String }) search: string,
    @Args('name', { type: () => String }) name: string,
    @Args('lastName', { type: () => String }) lastName: string,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<SearcherResponsePagination> {
    return this.searcherService.searcherPagination(
      search,
      name,
      lastName,
      paginationArgs,
    );
  }
}
