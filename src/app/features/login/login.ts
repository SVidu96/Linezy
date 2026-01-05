import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, EMPTY } from 'rxjs';
import { switchMap, finalize, takeUntil, catchError } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';
import { LoadingOverlayComponent } from '../../layout/loading-overlay/loading-overlay';
import { RoutePath } from '../../app.routes';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LoadingOverlayComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnDestroy {

  loginForm!: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(environment.MIN_PW_LENGTH)]],
    });
  }

  login(): void {
    this.validateForm();
    if (this.errorMessage) return;

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).pipe(
      switchMap(() => this.userService.loadCurrentUser()),
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
      catchError(() => {
        this.errorMessage = 'Invalid email or password';
        return EMPTY;
      })
    ).subscribe(() => {
      this.router.navigate([RoutePath.Home]);
    });
  }

  private validateForm(): void {
    this.sanitizeFormInputs();
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  private sanitizeFormInputs(): void {
    this.loginForm.patchValue({
      email: this.loginForm.value.email.trim().toLowerCase(),
      password: this.loginForm.value.password.trim()
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading = false;
    this.loginForm.reset();
  }
}
