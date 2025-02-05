import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { ProductDescription } from '../../types/supabase.types';

@Component({
  selector: 'app-product-seo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Previous Descriptions -->
        <div class="mb-8 bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 class="text-xl font-semibold text-gray-900">Previous Product Descriptions</h2>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div *ngFor="let description of productDescriptions" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ description.name }}</h3>
                <div class="text-sm text-gray-500 mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ description.tone }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-4">{{ description.details }}</p>
                <div class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Generated Description:</h4>
                  <p class="text-sm text-gray-600">{{ description.generated_description }}</p>
                </div>
                <div class="mt-4 text-xs text-gray-500">
                  Created: {{ description.created_at | date:'medium' }}
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="productDescriptions.length === 0" class="text-center py-12">
              <p class="text-gray-500">No product descriptions found. Generate your first one below!</p>
            </div>
          </div>
        </div>

        <!-- Generate New Description Form -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 class="text-xl font-semibold text-gray-900">Generate New Description</h2>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <form (ngSubmit)="generateDescription()" class="space-y-6">
              <!-- Product Name -->
              <div>
                <label for="productName" class="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  [(ngModel)]="product.name"
                  name="productName"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  [class.border-red-500]="submitted && !product.name"
                />
                <p *ngIf="submitted && !product.name" class="mt-1 text-sm text-red-600">
                  Product name is required
                </p>
              </div>

              <!-- Product Details -->
              <div>
                <label for="productDetails" class="block text-sm font-medium text-gray-700">Product Details</label>
                <textarea
                  id="productDetails"
                  [(ngModel)]="product.details"
                  name="productDetails"
                  rows="4"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  [class.border-red-500]="submitted && !product.details"
                ></textarea>
                <p *ngIf="submitted && !product.details" class="mt-1 text-sm text-red-600">
                  Product details are required
                </p>
              </div>

              <!-- Tone/Style -->
              <div>
                <label for="tone" class="block text-sm font-medium text-gray-700">Tone/Style</label>
                <select
                  id="tone"
                  [(ngModel)]="product.tone"
                  name="tone"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="isLoading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    *ngIf="isLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ isLoading ? 'Generating...' : 'Generate Description' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductSeoComponent implements OnInit {
  product = {
    name: '',
    details: '',
    tone: 'professional'
  };

  productDescriptions: ProductDescription[] = [];
  isLoading = false;
  error: string | null = null;
  submitted = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadProductDescriptions();
  }

  loadProductDescriptions() {
    this.supabaseService.getProductDescriptions().subscribe({
      next: (descriptions) => {
        this.productDescriptions = descriptions;
      },
      error: (error) => {
        console.error('Error loading product descriptions:', error);
        this.error = 'Failed to load product descriptions';
      }
    });
  }

  generateDescription() {
    this.submitted = true;

    if (!this.product.name || !this.product.details) {
      return;
    }

    this.isLoading = true;

    // For now, we'll use a dummy generated description
    const dummyDescription = `Introducing the ${this.product.name} - a revolutionary product that ${this.product.details.toLowerCase()}. This innovative solution offers unparalleled performance and reliability, making it the perfect choice for discerning customers who demand excellence.`;

    this.supabaseService.addProductDescription(
      this.product.name,
      this.product.details,
      dummyDescription,
      this.product.tone
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.submitted = false;
        this.product = {
          name: '',
          details: '',
          tone: 'professional'
        };
        this.loadProductDescriptions();
      },
      error: (error) => {
        console.error('Error saving product description:', error);
        this.error = 'Failed to save product description';
        this.isLoading = false;
      }
    });
  }
}