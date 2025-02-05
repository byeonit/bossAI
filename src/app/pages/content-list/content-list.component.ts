import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { MarketingContent } from '../../types/supabase.types';
import { catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow-sm rounded-lg">
          <!-- Header -->
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">Marketing Content</h2>
              <a
                routerLink="/add-marketing"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                Add New Content
              </a>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="px-4 py-5 sm:p-6">
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                *ngFor="let content of contentList"
                class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div class="p-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ content.title }}</h3>
                  <p class="text-gray-600 text-sm mb-4">{{ content.description }}</p>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">{{ content.created_at | date:'medium' }}</span>
                    <div class="space-x-2">
                      <a
                        [routerLink]="['/dashboard']"
                        [queryParams]="{ edit: content.id }"
                        class="text-primary hover:text-primary-dark"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="contentList.length === 0" class="text-center py-12">
              <p class="text-gray-500">No marketing content found.</p>
            </div>
          </div>

          <!-- Pagination -->
          <div class="px-4 py-4 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  [disabled]="currentPage === 0"
                  (click)="changePage(currentPage - 1)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  [disabled]="!hasNextPage"
                  (click)="changePage(currentPage + 1)"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ startIndex + 1 }}</span>
                    to
                    <span class="font-medium">{{ endIndex }}</span>
                    of
                    <span class="font-medium">{{ totalItems }}</span>
                    results
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      [disabled]="currentPage === 0"
                      (click)="changePage(currentPage - 1)"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="sr-only">Previous</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button
                      [disabled]="!hasNextPage"
                      (click)="changePage(currentPage + 1)"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="sr-only">Next</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContentListComponent implements OnInit {
  contentList: MarketingContent[] = [];
  currentPage = 0;
  pageSize = 9;
  totalItems = 0;
  hasNextPage = false;

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    from(this.supabaseService.getPaginatedMarketingContent(this.currentPage, this.pageSize))
      .pipe(
        catchError((error: Error) => {
          console.error('Error loading content:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to load marketing content',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2563eb'
          });
          return from([{ data: [], count: 0 }]);
        })
      )
      .subscribe(response => {
        this.contentList = response.data;
        this.totalItems = response.count;
        this.hasNextPage = (this.currentPage + 1) * this.pageSize < response.count;
      });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && (newPage * this.pageSize < this.totalItems || newPage === 0)) {
      this.currentPage = newPage;
      this.loadContent();
    }
  }
}