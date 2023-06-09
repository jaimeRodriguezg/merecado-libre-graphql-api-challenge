import { ObjectType, Field } from '@nestjs/graphql';
import { Author, GeneralItem } from '../../common/entities/common.entity';
import { PageInfo } from '../../common/entities/pagination.entity';

@ObjectType()
export class SearcherResponse {
  @Field(() => Author)
  author: Author;

  @Field(() => [String])
  categories: string[];

  @Field(() => [GeneralItem])
  items: GeneralItem[];
}

@ObjectType()
export class SearcherResponsePagination extends SearcherResponse {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
