import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpParamsOptions } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';
import { UserPropertyService } from '../user-property/user-property.service';

export interface RequestOptions {
  headers: HttpHeaders;
  params: HttpParams;
}

export abstract class BaseRequest{
  protected readonly baseUrl: string;
  protected readonly httpClient: HttpClient;


  protected constructor(httpClient: HttpClient, baseUrl: string = environment.backendUrl) {
    this.baseUrl = baseUrl;
    this.httpClient = httpClient;
  }
  protected create_options(params?: HttpParamsOptions) : RequestOptions {
    return  {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( params)
    };

  }
}
