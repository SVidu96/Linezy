import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { QueryParams, PaginatedResponse } from '../../interfaces/api.interface';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {

  endpoint: string = "";

  constructor(
    private httpClient: HttpClientService,
  ) { }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  private getUrl(suffix: string = ''): string {
    return `${environment.API_URL}/${this.endpoint}${suffix ? '/' + suffix : ''}`;
  }

  getAll(params?: QueryParams): Observable<T[]> {
    return this.httpClient.get<T[]>(this.getUrl(), params);
  }

  getPaginated(params?: QueryParams): Observable<PaginatedResponse<T>> {
    return this.httpClient.get<PaginatedResponse<T>>(this.getUrl('paginated'), params);
  }

  getById(id: string | number, string: any): Observable<T> {
    return this.httpClient.get<T>(this.getUrl(id.toString()));
  }

  create(item: TCreate): Observable<T> {
    return this.httpClient.post<T>(this.getUrl(), item);
  }

  update(id: string | number, item: TUpdate): Observable<T> {
    return this.httpClient.put<T>(this.getUrl(id.toString()), item);
  }

  partialUpdate(id: string | number, item: Partial<TUpdate>): Observable<T> {
    return this.httpClient.patch<T>(this.getUrl(id.toString()), item);
  }

  delete(id: string | number): Observable<void> {
    return this.httpClient.delete<void>(this.getUrl(id.toString()));
  }

  search(query: string, params?: QueryParams): Observable<T[]> {
    const searchParams = { ...params, q: query };
    return this.httpClient.get<T[]>(this.getUrl('search'), searchParams);
  }
}
