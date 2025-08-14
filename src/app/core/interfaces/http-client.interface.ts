import { Observable } from "rxjs";
import { QueryParams } from "./api.interface";

export interface IHttpClient {
  get<T>(url: string, params?: QueryParams): Observable<T>;
  post<T>(url: string, body?: any): Observable<T>;
  put<T>(url: string, body?: any): Observable<T>;
  patch<T>(url: string, body?: any): Observable<T>;
  delete<T>(url: string): Observable<T>;
}