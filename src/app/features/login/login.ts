import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';
import { LoadingOverlayComponent } from "../../layout/loading-overlay/loading-overlay";

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LoadingOverlayComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login implements OnDestroy {
  loginForm !: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(environment.MIN_PW_LENGTH)]],
    });
  }

  login(): void {
    this.validateForm();
    if (this.errorMessage) {
      return;
    }
    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.userService.loadCurrentUser().subscribe();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  private validateForm() {
    this.sanitizeFormInputs();
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = "Please fill out all required fields correctly.";
      return;
    }
  }

  private sanitizeFormInputs() {
    const cleaned = {
      email: this.loginForm.value.email.trim().toLowerCase(),
      password: this.loginForm.value.password.trim()
    };
    this.loginForm.patchValue(cleaned);
  }
  ngOnDestroy() {
    this.loading = false;
    this.loginForm.reset();
  }
}
