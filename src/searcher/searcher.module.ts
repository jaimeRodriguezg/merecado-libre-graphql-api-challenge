import { Module } from '@nestjs/common';
import { SearcherService } from './searcher.service';
import { SearcherResolver } from './searcher.resolver';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [SearcherResolver, SearcherService],
})
export class SearcherModule {}
