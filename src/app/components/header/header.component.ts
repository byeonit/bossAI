import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold text-primary">Boss AI</a>
          </div>
          <div class="flex items-center space-x-4">
            <ng-container *ngIf="(supabaseService.getCurrentUser() | async); else unauthenticated">
              <button
                (click)="signOut()"
                class="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </ng-container>
            <ng-template #unauthenticated>
              <a
                routerLink="/login"
                class="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Sign In
              </a>
              <a
                routerLink="/signup"
                class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                Sign Up
              </a>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  constructor(public supabaseService: SupabaseService) {}

  signOut() {
    this.supabaseService.signOut().subscribe(() => {
      // Handled by auth guard
    });
  }
}