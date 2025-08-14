import { Injectable } from '@angular/core';
import { BaseApiService } from './api-services/base-api.service';
import { IHttpClient } from '../interfaces/http-client.interface';
import { environment } from '../../../environments/environment';
import { HttpClientService } from './api-services/http-client.service';
import { Observable } from 'rxjs';
import { QueryParams } from '../interfaces/api.interface';
import { TestModel } from '../../models/datamodels/testmodel';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(httpClient: HttpClientService, private baseApiService: BaseApiService<TestModel>) {
    this.baseApiService.setEndpoint('WeatherForecast');
  }

  getAllTests():Observable<TestModel[]> {
     return this.baseApiService.getAll();
  }
}