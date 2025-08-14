import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IHttpClient } from '../../interfaces/http-client.interface';
import { ApiResponse, QueryParams } from '../../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService implements IHttpClient {
  constructor(private http: HttpClient) { }

  get<T>(url: string, params?: QueryParams): Observable<T> {
    return this.http.get<unknown>(url, { params: this.buildHttpParams(params) })
      .pipe(
        map(res => this.extractData<T>(res)),
        catchError(this.handleError)
      );
  }

  post<T>(url: string, body?: unknown): Observable<T> {
    return this.http.post<unknown>(url, body)
      .pipe(
        map(res => this.extractData<T>(res)),
        catchError(this.handleError)
      );
  }

  put<T>(url: string, body?: unknown): Observable<T> {
    return this.http.put<unknown>(url, body)
      .pipe(
        map(res => this.extractData<T>(res)),
        catchError(this.handleError)
      );
  }

  patch<T>(url: string, body?: unknown): Observable<T> {
    return this.http.patch<unknown>(url, body)
      .pipe(
        map(res => this.extractData<T>(res)),
        catchError(this.handleError)
      );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<unknown>(url)
      .pipe(
        map(res => this.extractData<T>(res)),
        catchError(this.handleError)
      );
  }

  private buildHttpParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private extractData<T>(response: unknown): T {
    if (this.isApiResponse<T>(response)) {
      if (!response.success) {
        throw new Error(response.errors?.join(', ') || response.message || 'API request failed');
      }
      return response.data;
    }
    return response as T;
  }

  private isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
    return typeof obj === 'object' &&
      obj !== null &&
      'success' in obj &&
      'data' in obj;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
  console.error('API Error:', error);

  let message = 'An unexpected error occurred';

  const err = error.error;

  if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object') {
    message =
      err.message ||
      (Array.isArray(err.errors) && err.errors.join(', ')) ||
      err.title ||
      message;
  } else if (error.message) {
    message = error.message;
  }

  if (error.status) {
    message = `${error.status}: ${message}`;
  }

  return throwError(() => new Error(message));
}

}
