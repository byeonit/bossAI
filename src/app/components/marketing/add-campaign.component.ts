import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-campaign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Add Marketing Campaign</h2>
      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Campaign Name -->
        <div>
          <label for="campaignName" class="block text-sm font-medium text-gray-700">Campaign Name</label>
          <input
            type="text"
            id="campaignName"
            [(ngModel)]="campaign.campaign_name"
            name="campaignName"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            [class.border-red-500]="submitted && !campaign.campaign_name"
          />
          <p *ngIf="submitted && !campaign.campaign_name" class="mt-1 text-sm text-red-600">
            Campaign name is required
          </p>
        </div>

        <!-- Target Audience -->
        <div>
          <label for="targetAudience" class="block text-sm font-medium text-gray-700">Target Audience</label>
          <input
            type="text"
            id="targetAudience"
            [(ngModel)]="campaign.target_audience"
            name="targetAudience"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            [class.border-red-500]="submitted && !campaign.target_audience"
          />
          <p *ngIf="submitted && !campaign.target_audience" class="mt-1 text-sm text-red-600">
            Target audience is required
          </p>
        </div>

        <!-- Budget -->
        <div>
          <label for="budget" class="block text-sm font-medium text-gray-700">Budget</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="budget"
              [(ngModel)]="campaign.budget"
              name="budget"
              required
              min="0"
              step="0.01"
              class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              [class.border-red-500]="submitted && !campaign.budget"
            />
          </div>
          <p *ngIf="submitted && !campaign.budget" class="mt-1 text-sm text-red-600">
            Budget is required
          </p>
        </div>

        <!-- Start Date -->
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            [(ngModel)]="campaign.start_date"
            name="startDate"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            [class.border-red-500]="submitted && !campaign.start_date"
          />
          <p *ngIf="submitted && !campaign.start_date" class="mt-1 text-sm text-red-600">
            Start date is required
          </p>
        </div>

        <!-- End Date -->
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            [(ngModel)]="campaign.end_date"
            name="endDate"
            required
            [min]="campaign.start_date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            [class.border-red-500]="submitted && !campaign.end_date"
          />
          <p *ngIf="submitted && !campaign.end_date" class="mt-1 text-sm text-red-600">
            End date is required
          </p>
          <p *ngIf="submitted && campaign.end_date && campaign.start_date && campaign.end_date < campaign.start_date" class="mt-1 text-sm text-red-600">
            End date must be after start date
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            (click)="cancel()"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="isLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Saving...' : 'Save Campaign' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class AddMarketingComponent {
  campaign = {
    campaign_name: '',
    target_audience: '',
    budget: null as number | null,
    start_date: '',
    end_date: ''
  };

  submitted = false;
  isLoading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  onSubmit() {
    this.submitted = true;

    // Validate form
    if (!this.campaign.campaign_name || 
        !this.campaign.target_audience || 
        !this.campaign.budget || 
        !this.campaign.start_date || 
        !this.campaign.end_date) {
      return;
    }

    // Validate dates
    if (this.campaign.end_date < this.campaign.start_date) {
      return;
    }

    this.isLoading = true;

    this.supabaseService.addCampaign(this.campaign).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Campaign has been created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/campaigns']);
        });
      },
      error: (error) => {
        console.error('Error creating campaign:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to create campaign',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/campaigns']);
  }
}