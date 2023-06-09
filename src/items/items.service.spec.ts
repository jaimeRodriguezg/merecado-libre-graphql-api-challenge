import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HandleErrorService } from '../common/handle-errors.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CommonModule } from '../common/common.module';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CommonModule],
      providers: [
        ItemsService,
        HandleErrorService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findItems should return expected data', async () => {
    const id = 'perros';
    const name = 'Jaime';
    const lastName = 'Rodríguez';
    const mockItemResponse = {
      id: 'someId',
      title: 'someTitle',
      currency_id: 'someCurrencyId',
      price: 1234.56,
      thumbnail: 'someThumbnailUrl',
      condition: 'new',
      shipping: { free_shipping: true },
      sold_quantity: 100,
      pictures: [
        { id: 'pic1', url: 'url1' },
        { id: 'pic2', url: 'url2' },
      ],
    };

    const mockDescriptionResponse = {
      plain_text: 'someDescription',
    };

    const mockHttpService = {
      get: jest.fn().mockImplementation((url) => {
        if (url.includes('/description')) {
          return of({
            data: mockDescriptionResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as AxiosResponse);
        } else {
          return of({
            data: mockItemResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as AxiosResponse);
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CommonModule],
      providers: [
        ItemsService,
        HandleErrorService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    httpService = module.get<HttpService>(HttpService);

    const result = await service.findItems(id, name, lastName);

    expect(result.author.name).toBe(name);
    expect(result.author.lastname).toBe(lastName);
  });
});
