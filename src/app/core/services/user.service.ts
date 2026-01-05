import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UserApiService } from './api-services/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _currentUser$ = new BehaviorSubject<User | null>(null);

  /** Public read-only stream */
  readonly currentUser$ = this._currentUser$.asObservable();

  constructor(private userApiService: UserApiService) {}

  loadCurrentUser(): Observable<User> {
    return this.userApiService.getUser().pipe(
      tap(user => this._currentUser$.next(user))
    );
  }

  setCurrentUser(user: User | null): void {
    this._currentUser$.next(user);
  }

  /** Synchronous snapshot (guards, interceptors) */
  getCurrentUser(): User | null {
    return this._currentUser$.value;
  }
}