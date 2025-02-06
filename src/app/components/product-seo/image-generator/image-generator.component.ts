import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ImageGenerationOptions, GeneratedImage } from '../../../types/supabase.types';
import { SupabaseService } from '../../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Generate Product Images</h2>

      <form (ngSubmit)="generateImage()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Platform</label>
          <select
            [(ngModel)]="imageOptions.platform"
            name="platform"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="instagram">Instagram</option>
            <option value="pinterest">Pinterest</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Style</label>
          <select
            [(ngModel)]="imageOptions.style"
            name="style"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="realistic">Realistic</option>
            <option value="artistic">Artistic</option>
            <option value="minimalist">Minimalist</option>
            <option value="vintage">Vintage</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Aspect Ratio</label>
          <select
            [(ngModel)]="imageOptions.aspectRatio"
            name="aspectRatio"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option *ngFor="let ratio of aspectRatios" [value]="ratio">{{ ratio }}</option>
          </select>
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="imageOptions.includeText"
              name="includeText"
              class="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700">Include Text</span>
          </label>

          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="imageOptions.includeLogo"
              name="includeLogo"
              class="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="ml-2 text-sm text-gray-700">Include Logo</span>
          </label>
        </div>

        <button
          type="submit"
          [disabled]="isGenerating || !selectedProduct"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {{ isGenerating ? 'Generating...' : 'Generate Image' }}
        </button>
      </form>

      <!-- Generated Image Preview -->
      <div *ngIf="generatedImage" class="mt-6">
        <h3 class="text-lg font-medium mb-4">Generated Image</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          <img [src]="generatedImage.imageUrl" alt="Generated product image" class="w-full rounded-lg shadow-sm" />
          <div class="mt-4 flex justify-end">
            <button
              (click)="saveImage()"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save Image
            </button>
          </div>
        </div>
      </div>

      <!-- Saved Images -->
      <div *ngIf="savedImages.length > 0" class="mt-8">
        <h3 class="text-lg font-medium mb-4">Saved Images</h3>
        <div class="grid grid-cols-2 gap-4">
          <div *ngFor="let image of savedImages" class="relative">
            <img [src]="image.imageUrl" alt="Saved product image" class="w-full rounded-lg shadow-sm" />
            <button
              (click)="deleteImage(image.id)"
              class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImageGeneratorComponent implements OnInit {
  @Input() selectedProduct: Product | null = null;

  imageOptions: ImageGenerationOptions = {
    platform: 'instagram',
    style: 'realistic',
    mood: 'bright',
    composition: 'product_only',
    background: 'plain',
    colorScheme: 'brand_colors',
    includeText: false,
    includeLogo: false,
    aspectRatio: '1:1'
  };

  aspectRatios: ('1:1' | '4:5' | '16:9' | '9:16')[] = ['1:1', '4:5', '16:9', '9:16'];
  isGenerating = false;
  generatedImage: GeneratedImage | null = null;
  savedImages: GeneratedImage[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    if (this.selectedProduct) {
      this.loadSavedImages(this.selectedProduct.id);
    }
  }

  generateImage() {
    if (!this.selectedProduct) return;

    this.isGenerating = true;

    // Simulated image generation
    setTimeout(() => {
      this.generatedImage = {
        id: `temp-${Date.now()}`,
        product_id: this.selectedProduct!.id,
        platform: this.imageOptions.platform,
        imageUrl: 'https://picsum.photos/800/800',
        prompt: `Generate a ${this.imageOptions.style} product image for ${this.selectedProduct!.name}`,
        options: { ...this.imageOptions },
        created_at: new Date().toISOString()
      };
      this.isGenerating = false;

      Swal.fire({
        title: 'Success!',
        text: 'Image generated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb'
      });
    }, 2000);
  }

  saveImage() {
    if (!this.generatedImage || !this.selectedProduct) return;

    this.supabaseService.saveGeneratedImage(this.generatedImage).subscribe({
      next: (savedImage) => {
        this.savedImages = [savedImage, ...this.savedImages];
        this.generatedImage = null;
        Swal.fire({
          title: 'Success!',
          text: 'Image saved successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      },
      error: (error) => {
        console.error('Error saving image:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to save image',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  deleteImage(imageId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.supabaseService.deleteGeneratedImage(imageId).subscribe({
          next: () => {
            this.savedImages = this.savedImages.filter(img => img.id !== imageId);
            Swal.fire({
              title: 'Deleted!',
              text: 'Image deleted successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2563eb'
            });
          },
          error: (error) => {
            console.error('Error deleting image:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete image',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2563eb'
            });
          }
        });
      }
    });
  }

  private loadSavedImages(productId: string) {
    this.supabaseService.getGeneratedImages(productId).subscribe({
      next: (images) => {
        this.savedImages = images;
      },
      error: (error) => {
        console.error('Error loading saved images:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load saved images',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }
}