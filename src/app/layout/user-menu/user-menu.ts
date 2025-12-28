import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  imports: [RouterLink],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss'
})
export class UserMenu implements OnInit, OnDestroy {
  displayName: string = '';
  loggedUser: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.loggedUser = user;
      this.displayName = user ? user.fullName : '';
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}