import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class HandleErrorService {
  public handleErrorExceptions(service: string, method: string, error: any) {
    throw new InternalServerErrorException(
      `Unexpected error, check server logs: $[${service} - ${method}]: ${error}}`,
    );
  }
}
