import { Injectable } from '@angular/core';
import { UserApiService } from './api-services/user-api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private userApiService: UserApiService) { }

  loadCurrentUser(): Observable<User> {
    return this.userApiService.getUser().pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
      })
    )
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }


}