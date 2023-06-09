import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Author, GeneralItem } from '../../common/entities/common.entity';

@ObjectType()
export class Picture {
  @Field(() => String)
  id: string;

  @Field(() => String)
  url: string;
}

@ObjectType()
export class Item extends GeneralItem {
  @Field(() => Int)
  sold_quantity: number;

  @Field(() => String)
  description: string;

  @Field(() => [Picture])
  pictures: Picture[];
}

@ObjectType()
export class ItemResponse {
  @Field(() => Author)
  author: Author;

  @Field(() => Item)
  item: Item;
}
