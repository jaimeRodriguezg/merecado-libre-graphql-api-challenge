import { Resolver, Query, Args } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { ItemResponse } from './entities/item.entity';

@Resolver(() => ItemResponse)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => ItemResponse, { name: 'items' })
  async findAll(
    @Args('id', { type: () => String }) id: string,
    @Args('name', { type: () => String }) name: string,
    @Args('lastName', { type: () => String }) lastName: string,
  ): Promise<ItemResponse> {
    return this.itemsService.findItems(id, name, lastName);
  }
}
