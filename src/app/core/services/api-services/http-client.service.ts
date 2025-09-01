import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, QueryParams } from '../../interfaces/api.interface';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: QueryParams): Observable<T> {
    return this.http.get<unknown>(url, { params: this.buildHttpParams(params) }).pipe(
      map(res => this.extractData<T>(res)),
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body?: unknown): Observable<T> {
    return this.http.post<unknown>(url, body).pipe(
      map(res => this.extractData<T>(res)),
      catchError(this.handleError)
    );
  }

  put<T>(url: string, body?: unknown): Observable<T> {
    return this.http.put<unknown>(url, body).pipe(
      map(res => this.extractData<T>(res)),
      catchError(this.handleError)
    );
  }

  patch<T>(url: string, body?: unknown): Observable<T> {
    return this.http.patch<unknown>(url, body).pipe(
      map(res => this.extractData<T>(res)),
      catchError(this.handleError)
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<unknown>(url).pipe(
      map(res => this.extractData<T>(res)),
      catchError(this.handleError)
    );
  }

  private buildHttpParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) httpParams = httpParams.set(key, String(value));
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
    return !!obj && typeof obj === 'object' && 'success' in obj && 'data' in obj;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error && typeof error.error === 'object') {
      errorMessage =
        error.error.message ||
        (Array.isArray(error.error.errors) && error.error.errors.join(', ')) ||
        error.error.title ||
        errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (error.status) {
      errorMessage = `Server Error (${error.status}): ${errorMessage}`;
    }

    console.error('HTTP Error:', error);

    return throwError(() => new Error(errorMessage));
  }
}
