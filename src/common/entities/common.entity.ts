import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(() => String)
  name: string;

  @Field(() => String)
  lastname: string;
}

@ObjectType()
export class Price {
  @Field(() => String)
  currency: string;

  @Field()
  amount: number;

  @Field(() => Float)
  decimals: number;
}

@ObjectType()
export class GeneralItem {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => Price)
  price: Price;

  @Field(() => String)
  thumbnail: string;

  @Field(() => String)
  condition: string;

  @Field(() => Boolean)
  free_shipping: boolean;
}
