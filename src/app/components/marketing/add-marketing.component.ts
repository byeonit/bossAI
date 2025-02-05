import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-add-marketing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Add Marketing Content</h2>
      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            [(ngModel)]="title"
            name="title"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            [(ngModel)]="description"
            name="description"
            rows="4"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            [disabled]="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {{ isLoading ? 'Adding...' : 'Add Content' }}
          </button>
        </div>
      </form>
      <div *ngIf="error" class="mt-4 text-sm text-red-600">
        {{ error }}
      </div>
    </div>
  `
})
export class AddMarketingComponent {
  title: string = '';
  description: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.title || !this.description) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.supabaseService.addMarketingContent(this.title, this.description)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = error.message || 'Failed to add marketing content';
          this.isLoading = false;
        }
      });
  }
}