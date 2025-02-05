import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { User } from '@supabase/supabase-js';
import { MarketingContent } from '../../types/supabase.types';
import Swal from 'sweetalert2';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
            <!-- User Info Section -->
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Welcome to BossAI</h2>
                <button
                  (click)="signOut()"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Sign Out
                </button>
              </div>

              <div *ngIf="user" class="border-t border-gray-200 pt-4">
                <dl class="divide-y divide-gray-200">
                  <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ user.email }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Marketing Content Section -->
            <div class="p-6">
              <div class="mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h3 class="text-lg font-medium text-gray-900">Marketing Content</h3>
                  <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <!-- Search Bar -->
                    <div class="relative flex-grow max-w-md">
                      <input
                        type="text"
                        [(ngModel)]="searchQuery"
                        (ngModelChange)="onSearchChange($event)"
                        placeholder="Search content..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                      <div *ngIf="isSearching" class="absolute right-3 top-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      </div>
                    </div>
                    <button
                      (click)="addNewContent()"
                      class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap"
                    >
                      Add New Content
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div *ngFor="let content of marketingContent" class="bg-gray-50 p-4 rounded-lg">
                  <div *ngIf="editingContent?.id !== content.id; else editForm">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="text-lg font-medium text-gray-900">{{ content.title }}</h4>
                        <p class="mt-1 text-sm text-gray-600">{{ content.description }}</p>
                        <p class="mt-2 text-xs text-gray-500">Created: {{ content.created_at | date:'medium' }}</p>
                      </div>
                      <div class="flex space-x-2">
                        <button
                          (click)="startEditing(content)"
                          class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          (click)="deleteContent(content)"
                          class="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <ng-template #editForm>
                    <form (submit)="updateContent(content.id)" class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          [ngModel]="editingContent!.title"
                          (ngModelChange)="editingContent!.title = $event"
                          name="title"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          [ngModel]="editingContent!.description"
                          (ngModelChange)="editingContent!.description = $event"
                          name="description"
                          rows="3"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        ></textarea>
                      </div>
                      <div class="flex justify-end space-x-2">
                        <button
                          type="button"
                          (click)="cancelEditing()"
                          class="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </ng-template>
                </div>

                <!-- No Results Message -->
                <div *ngIf="marketingContent.length === 0" class="text-center py-4 text-gray-500">
                  {{ searchQuery ? 'No results found for your search.' : 'No marketing content yet. Click "Add New Content" to get started.' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  marketingContent: MarketingContent[] = [];
  editingContent: { id: string; title: string; description: string } | null = null;
  searchQuery: string = '';
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    this.supabaseService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.loadMarketingContent();
      }
    });
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  performSearch(query: string) {
    this.isSearching = true;
    this.supabaseService.searchMarketingContent(query).subscribe({
      next: (content) => {
        this.marketingContent = content;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error searching content:', error);
        this.isSearching = false;
        Swal.fire({
          title: 'Error',
          text: 'Failed to search marketing content',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  loadMarketingContent() {
    this.supabaseService.getMarketingContent().subscribe({
      next: (content) => {
        this.marketingContent = content;
      },
      error: (error) => {
        console.error('Error loading marketing content:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load marketing content',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  addNewContent() {
    this.router.navigate(['/add-marketing']);
  }

  startEditing(content: MarketingContent) {
    this.editingContent = {
      id: content.id,
      title: content.title,
      description: content.description
    };
  }

  cancelEditing() {
    this.editingContent = null;
  }

  updateContent(id: string) {
    if (!this.editingContent) return;

    this.supabaseService.updateMarketingContent(
      id,
      this.editingContent.title,
      this.editingContent.description
    ).subscribe({
      next: () => {
        this.loadMarketingContent();
        this.editingContent = null;
      },
      error: (error) => {
        console.error('Error updating content:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update marketing content',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  async deleteContent(content: MarketingContent) {
    console.log('Initiating delete for content:', content);

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this content?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      console.log('Delete confirmed for content ID:', content.id);
      
      this.supabaseService.deleteMarketingContent(content.id).subscribe({
        next: () => {
          console.log('Content successfully deleted');
          this.loadMarketingContent();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your marketing content has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2563eb'
          });
        },
        error: (error) => {
          console.error('Error deleting content:', error);
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong while deleting.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2563eb'
          });
        }
      });
    }
  }

  signOut() {
    this.supabaseService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error signing out:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to sign out',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }
}