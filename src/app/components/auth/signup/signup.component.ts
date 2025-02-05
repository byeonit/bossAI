import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                [(ngModel)]="email"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                [(ngModel)]="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {{ isLoading ? 'Creating account...' : 'Sign up' }}
            </button>
          </div>

          <div class="text-sm text-center">
            <a routerLink="/login" class="font-medium text-primary hover:text-primary-dark">
              Already have an account? Sign in
            </a>
          </div>
        </form>

        <div *ngIf="error" class="mt-4 text-center text-sm text-red-600">
          {{ error }}
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.supabaseService.signUp({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          if (response.error) {
            this.error = response.error.message;
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.error = error.message || 'An error occurred during sign up';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}