import { Test, TestingModule } from '@nestjs/testing';
import { SearcherService } from './searcher.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HandleErrorService } from '../common/handle-errors.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CommonModule } from '../common/common.module';

describe('SearcherService', () => {
  let service: SearcherService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CommonModule],
      providers: [
        SearcherService,
        HandleErrorService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearcherService>(SearcherService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return expected data', async () => {
    const search = 'perros';
    const name = 'Jaime';
    const lastName = 'Rodríguez';
    const mockSearcherResponse = {
      results: [
        {
          id: 'MLA1',
          title: 'Perro 1',
          price: 300.5,
          thumbnail: 'https://example.com/img1.jpg',
          condition: 'new',
          shipping: {
            free_shipping: true,
          },
          currency_id: 'ARS',
        },
        {
          id: 'MLA2',
          title: 'Perro 2',
          price: 500,
          thumbnail: 'https://example.com/img2.jpg',
          condition: 'used',
          shipping: {
            free_shipping: false,
          },
          currency_id: 'ARS',
        },
      ],
      paging: {
        total: 200,
      },
      filters: [
        {
          id: 'category',
          values: [
            {
              path_from_root: [
                {
                  name: 'Animales y Mascotas',
                },
                {
                  name: 'Perros',
                },
              ],
            },
          ],
        },
      ],
    };

    jest.spyOn(httpService, 'get').mockImplementation(() =>
      of({
        data: mockSearcherResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse),
    );

    const result = await service.searcher(search, name, lastName);

    expect(result.author.name).toBe(name);
    expect(result.author.lastname).toBe(lastName);
  });
});
