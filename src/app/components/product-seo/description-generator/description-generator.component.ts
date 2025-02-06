import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductDescription } from '../../../types/supabase.types';
import { SupabaseService } from '../../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-description-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Generate Product Description</h2>
      
      <form (ngSubmit)="generateDescription()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            [(ngModel)]="product.name"
            name="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            [class.border-red-500]="submitted && !product.name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Product Details</label>
          <textarea
            [(ngModel)]="product.details"
            name="details"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            [class.border-red-500]="submitted && !product.details"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tone</label>
          <select
            [(ngModel)]="product.tone"
            name="tone"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <button
          type="submit"
          [disabled]="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {{ isLoading ? 'Generating...' : 'Generate Description' }}
        </button>
      </form>

      <!-- Generated Descriptions -->
      <div *ngIf="descriptions.length > 0" class="mt-6">
        <h3 class="text-lg font-medium mb-4">Generated Descriptions</h3>
        <div class="space-y-4">
          <div *ngFor="let desc of descriptions" class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-900">{{ desc.generated_description }}</p>
            <div class="mt-2 flex justify-between items-center text-sm">
              <span class="text-gray-500">{{ desc.created_at | date:'medium' }}</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ desc.tone }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DescriptionGeneratorComponent {
  @Input() selectedProduct: Product | null = null;
  @Input() descriptions: ProductDescription[] = [];
  @Output() descriptionGenerated = new EventEmitter<void>();

  product = {
    name: '',
    details: '',
    tone: 'professional'
  };

  isLoading = false;
  submitted = false;

  constructor(private supabaseService: SupabaseService) {}

  generateDescription() {
    this.submitted = true;

    if (!this.product.name || !this.product.details) {
      return;
    }

    this.isLoading = true;

    this.supabaseService.addProductDescription(
      this.product.name,
      this.product.details,
      this.product.tone
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.submitted = false;
        this.descriptionGenerated.emit();
        this.resetForm();
        Swal.fire({
          title: 'Success!',
          text: 'Product description generated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      },
      error: (error) => {
        console.error('Error generating description:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Failed to generate product description',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  private resetForm() {
    this.product = {
      name: '',
      details: '',
      tone: 'professional'
    };
  }
}