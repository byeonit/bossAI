import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../types/supabase.types';

@Component({
  selector: 'app-product-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700">Select Product</label>
      <select
        (change)="onProductSelect($event)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
      >
        <option value="">Select a product</option>
        <option *ngFor="let product of products" [value]="product.id">
          {{ product.name }}
        </option>
      </select>
    </div>
  `
})
export class ProductSelectorComponent {
  @Input() products: Product[] = [];
  @Output() productSelected = new EventEmitter<Product>();

  onProductSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const productId = select.value;
    const selectedProduct = this.products.find(p => p.id === productId);
    if (selectedProduct) {
      this.productSelected.emit(selectedProduct);
    }
  }
}