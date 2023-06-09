import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
