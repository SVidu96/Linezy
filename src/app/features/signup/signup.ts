import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from '../../layout/loading-overlay/loading-overlay';
import { SignupRequest } from '../../core/models/auth.model';
import { environment } from '../../../environments/environment';
import { RoutePath } from '../../app.routes';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, LoadingOverlayComponent],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnDestroy {
  signupform!: FormGroup
  errorMessage: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupform = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(environment.MIN_PW_LENGTH)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(environment.MIN_PW_LENGTH)]],
    });
  }

  signup() {
    this.validateForm();
    if (this.errorMessage) {
      return;
    }
    this.loading = true;
    this.errorMessage = null;

    this.authService.signup(this.getSignupPayload()).subscribe({
      next: (response) => {
        this.router.navigate([RoutePath.Login]);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Signup failed. Please try again.';
        this.loading = false;
      }
    });
  }

  private validateForm() {
    this.sanitizeFormInputs();
    this.errorMessage = null;
    if (this.signupform.invalid) {
      this.signupform.markAllAsTouched();
      this.errorMessage = "Please fill out all required fields correctly.";
      return;
    }
    if (this.signupform.value.password !== this.signupform.value.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }
    if (!this.isValidPassword(this.signupform.value.password)) {
      this.errorMessage = "Password must be at least 8 characters long and include uppercase, lowercase letters, and a number.";
      return;
    }
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password);
  }

  private sanitizeFormInputs() {
    const cleaned = {
      fullName: this.signupform.value.fullName.trim(),
      email: this.signupform.value.email.trim().toLowerCase(),
      password: this.signupform.value.password.trim(),
      confirmPassword: this.signupform.value.confirmPassword.trim()
    };
    this.signupform.patchValue(cleaned);
  }

  private getSignupPayload(): SignupRequest {
    return {
      fullName: this.signupform.value.fullName,
      email: this.signupform.value.email,
      password: this.signupform.value.password
    };
  }

  ngOnDestroy() {
    this.loading = false;
    this.signupform.reset();
  }
}