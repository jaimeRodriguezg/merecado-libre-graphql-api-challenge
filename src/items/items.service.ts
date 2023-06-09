import { Injectable } from '@nestjs/common';
import { HandleErrorService } from '../common/handle-errors.service';
import { HttpService } from '@nestjs/axios';
import { Item, ItemResponse } from './entities/item.entity';
import { firstValueFrom } from 'rxjs';
import { Price } from '../common/entities/common.entity';

@Injectable()
export class ItemsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly handleErrorService: HandleErrorService,
  ) {}

  async findItems(
    id: string,
    name: string,
    lastName: string,
  ): Promise<ItemResponse> {
    try {
      const encodedSearch = encodeURIComponent(id);

      const [response, responseDescription] = await Promise.all([
        firstValueFrom(
          this.httpService.get(
            `${process.env.MERCADO_LIBRE_API}/items/${encodedSearch}`,
          ),
        ),
        firstValueFrom(
          this.httpService.get(
            `${process.env.MERCADO_LIBRE_API}/items/${id}/description`,
          ),
        ),
      ]);

      return this.parseResponse(
        response.data,
        responseDescription.data,
        name,
        lastName,
      );
    } catch (error) {
      this.handleErrorService.handleErrorExceptions(
        'ItemsService',
        'findItems',
        error,
      );
    }
  }

  parseResponse(
    response: any,
    responseDescription: any,
    name: string,
    lastName: string,
  ): ItemResponse {
    const itemResponse = new ItemResponse();

    itemResponse.author = { name, lastname: lastName };

    itemResponse.item = new Item();

    itemResponse.item.id = response.id ?? '';
    itemResponse.item.title = response.title ?? '';

    itemResponse.item.price = new Price();

    itemResponse.item.price.currency = response.currency_id
      ? response.currency_id
      : '';
    itemResponse.item.price.amount = response.price
      ? Math.floor(response.price)
      : 0;
    itemResponse.item.price.decimals = response.price
      ? +(response.price % 1).toFixed(2)
      : 0;
    itemResponse.item.thumbnail = response.thumbnail ?? '';
    itemResponse.item.condition = response.condition ?? '';
    itemResponse.item.free_shipping = response.shipping.free_shipping;
    itemResponse.item.sold_quantity = response.sold_quantity;
    itemResponse.item.description = responseDescription.plain_text;

    itemResponse.item.pictures =
      response.pictures && response.pictures.length
        ? response.pictures.map((picture) => ({
            id: picture.id ?? '',
            url: picture.url ?? '',
          }))
        : [];

    return itemResponse;
  }
}
