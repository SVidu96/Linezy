import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiOptions {
  headers?: HttpHeaders;
  params?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private readonly baseUrl: string = environment.API_URL + '/api';
  private readonly defaultHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  get<T>(url: string, options?: ApiOptions): Observable<T> {
    const httpOptions: { params?: HttpParams } = {};
    if (options?.params) {
      httpOptions.params = this.buildParams(options.params);
    }
    return this.http.get<T>(`${this.baseUrl}${url}`, httpOptions);
  }

  post<T>(url: string, body: any, options?: ApiOptions): Observable<T> {
    const requestHeaders = options?.headers || this.defaultHeaders;
    return this.http.post<T>(`${this.baseUrl}${url}`, body, { headers: requestHeaders });
  }

  put<T>(url: string, body: any, options?: ApiOptions): Observable<T> {
    const requestHeaders = options?.headers || this.defaultHeaders;
    return this.http.put<T>(`${this.baseUrl}${url}`, body, { headers: requestHeaders });
  }

  delete<T>(url: string, options?: ApiOptions): Observable<T> {
    const httpOptions: { headers?: HttpHeaders } = {};
    if (options?.headers) {
      httpOptions.headers = options.headers;
    }
    return this.http.delete<T>(`${this.baseUrl}${url}`, httpOptions);
  }

  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return httpParams;
  }
}
