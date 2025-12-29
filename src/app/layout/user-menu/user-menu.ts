import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Subscription } from 'rxjs';
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay";

@Component({
  selector: 'app-user-menu',
  imports: [RouterLink, LoadingOverlayComponent],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss'
})
export class UserMenu implements OnInit, OnDestroy {
  displayName: string = '';
  loggedUser: User | null = null;
  private userSubscription: Subscription | null = null;
  loading: boolean = false;

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
    this.loading = true;
    this.authService.logout();
    this.loading = false;
    this.router.navigate(['/home']);
  }
}