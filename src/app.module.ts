import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { HttpModule } from '@nestjs/axios';
import { SearcherModule } from './searcher/searcher.module';
import { CommonModule } from './common/common.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    //Config .env
    ConfigModule.forRoot(),

    //Config graphql
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [
        process.env.STATE === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault({ embed: false }),
      ],
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),

    //Axios config
    HttpModule,

    //Modules
    CommonModule,
    SearcherModule,
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
