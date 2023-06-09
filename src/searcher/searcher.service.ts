import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  SearcherResponse,
  SearcherResponsePagination,
} from './entities/searcher.entity';
import { HandleErrorService } from '../common/handle-errors.service';
import { GeneralItem } from '../common/entities/common.entity';
import { PaginationArgs } from '../common/dto/pagination.args';
import { PageInfo } from '../common/entities/pagination.entity';

@Injectable()
export class SearcherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly handleErrorService: HandleErrorService,
  ) {}

  async searcher(
    search: string,
    name: string,
    lastName: string,
  ): Promise<SearcherResponse> {
    try {
      const encodedSearch = encodeURIComponent(search);
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.MERCADO_LIBRE_API}/sites/MLA/search?q=${encodedSearch}`,
        ),
      );

      return this.parseResponse(response.data, name, lastName);
    } catch (error) {
      this.handleErrorService.handleErrorExceptions(
        'SearcherService',
        'searcher',
        error,
      );
    }
  }

  async searcherPagination(
    search: string,
    name: string,
    lastName: string,
    paginationArgs: PaginationArgs,
  ): Promise<SearcherResponsePagination> {
    const { limit, offset } = paginationArgs;

    try {
      const encodedSearch = encodeURIComponent(search);
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.MERCADO_LIBRE_API}/sites/MLA/search?q=${encodedSearch}&offset=${offset}&limit=${limit}`,
        ),
      );

      console.log(response);

      return this.parseResponsePagination(
        response.data,
        name,
        lastName,
        offset,
        limit,
      );
    } catch (error) {
      this.handleErrorService.handleErrorExceptions(
        'SearcherService',
        'searcher',
        error,
      );
    }
  }

  parseResponse(
    response: any,
    name: string,
    lastName: string,
  ): SearcherResponse {
    const searchResponse = new SearcherResponse();

    searchResponse.author = { name, lastname: lastName };

    searchResponse.categories =
      response.filters
        .find((filter) => filter.id === 'category')
        ?.values[0].path_from_root.map((category) => category.name) || [];

    searchResponse.items = response.results.map((item) => {
      const parsedItem = new GeneralItem();

      parsedItem.id = item.id ?? '';
      parsedItem.title = item.title ?? '';
      parsedItem.price = {
        currency: item.currency_id ?? '',
        //redondeamos el numero hacia abajo ej: 124.34 --> 124
        amount: item.price ? Math.floor(item.price) : 0,
        // tomamos el módulo del item price y obteniendo la parte decimal, lo redondeamos a dos decimales
        decimals: item.price ? +(item.price % 1).toFixed(2) : 0,
      };
      parsedItem.thumbnail = item.thumbnail ?? '';
      parsedItem.condition = item.condition ?? '';
      parsedItem.free_shipping = item.shipping.free_shipping;

      return parsedItem;
    });

    return searchResponse;
  }

  parseResponsePagination(
    response: any,
    name: string,
    lastName: string,
    offset: number,
    limit: number,
  ): SearcherResponsePagination {
    const searchResponsePagination = new SearcherResponsePagination();
    const seaarchResponse = this.parseResponse(response, name, lastName);

    searchResponsePagination.author = seaarchResponse.author;
    searchResponsePagination.categories = seaarchResponse.categories;
    searchResponsePagination.items = seaarchResponse.items;

    //pagination

    const currentPage = offset / limit + 1;
    const perPage = limit;
    const totalItems = response.paging.total;
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    const pageInfo = new PageInfo();
    pageInfo.currentPage = currentPage;
    pageInfo.perPage = perPage;
    pageInfo.totalPages = totalPages;
    pageInfo.totalItems = totalItems;
    pageInfo.hasPreviousPage = hasPreviousPage;
    pageInfo.hasNextPage = hasNextPage;

    searchResponsePagination.pageInfo = pageInfo;

    return searchResponsePagination;
  }
}
