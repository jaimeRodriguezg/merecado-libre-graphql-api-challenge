import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class HandleErrorService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
  ) {}

  public handleErrorExceptions(service: string, method: string, error: any) {
    this.winstonLogger.error(`[${service} - ${method}]: ${error}`);
    throw new InternalServerErrorException(
      `Unexpected error, check server logs: $[${service} - ${method}]: ${error}}`,
    );
  }
}
