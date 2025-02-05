import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { MarketingCampaign, MarketingContent } from '../../types/supabase.types';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

interface CampaignDetails extends MarketingCampaign {
  linked_content?: MarketingContent[];
}

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 p-4 rounded-md">
          <p class="text-red-700">{{ error }}</p>
        </div>

        <!-- Campaign Details -->
        <div *ngIf="campaign && !isLoading" class="space-y-6">
          <!-- Header with Back Button -->
          <div class="flex items-center justify-between">
            <button
              (click)="goBack()"
              class="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Campaigns
            </button>
            <button
              (click)="editCampaign()"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Edit Campaign
            </button>
          </div>

          <!-- Campaign Header -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ campaign.campaign_name }}
              </h1>
            </div>
            <div class="px-6 py-5">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Target Audience</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ campaign.target_audience }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Budget</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ campaign.budget | currency }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ campaign.start_date | date:'mediumDate' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">End Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ campaign.end_date | date:'mediumDate' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Campaign Status</dt>
                  <dd class="mt-1">
                    <span
                      [class]="getCampaignStatusClass()"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ getCampaignStatus() }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Linked Content Section -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900">Linked Marketing Content</h2>
                <button
                  (click)="linkContent()"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Link Content
                </button>
              </div>
            </div>
            <div class="px-6 py-5">
              <div *ngIf="(campaign?.linked_content?.length ?? 0) === 0" class="text-center py-6 text-gray-500">
                No content linked to this campaign yet
              </div>
              <div *ngIf="(campaign?.linked_content?.length ?? 0) > 0" class="space-y-4">
                <div *ngFor="let content of campaign.linked_content" class="border rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ content.title }}</h3>
                      <p class="mt-1 text-sm text-gray-600">{{ content.description }}</p>
                    </div>
                    <button
                      (click)="unlinkContent(content.id)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Unlink
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics Placeholder -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Performance Metrics</h2>
            </div>
            <div class="px-6 py-5">
              <p class="text-gray-500 text-center">Performance metrics coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CampaignDetailsComponent implements OnInit {
  campaign: CampaignDetails | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.loadCampaignDetails();
  }

  loadCampaignDetails() {
    const campaignId = this.route.snapshot.paramMap.get('id');
    if (!campaignId) {
      this.error = 'Campaign ID is required';
      this.isLoading = false;
      return;
    }

    this.supabaseService.getCampaignDetails(campaignId).pipe(
      switchMap(campaign => {
        return forkJoin({
          campaign: of(campaign),
          content: this.supabaseService.getCampaignContent(campaignId).pipe(
            catchError(() => of([]))
          )
        });
      })
    ).subscribe({
      next: ({ campaign, content }) => {
        this.campaign = {
          ...campaign,
          linked_content: content
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading campaign details:', error);
        this.error = 'Failed to load campaign details';
        this.isLoading = false;
      }
    });
  }

  getCampaignStatus(): string {
    if (!this.campaign) return 'Unknown';
    
    const now = new Date();
    const startDate = new Date(this.campaign.start_date);
    const endDate = new Date(this.campaign.end_date);

    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Completed';
    return 'Active';
  }

  getCampaignStatusClass(): string {
    const status = this.getCampaignStatus();
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  goBack() {
    this.router.navigate(['/campaigns']);
  }

  editCampaign() {
    if (this.campaign) {
      this.router.navigate(['/campaigns', this.campaign.id, 'edit']);
    }
  }

  linkContent() {
    // To be implemented
    Swal.fire({
      title: 'Coming Soon',
      text: 'Content linking feature will be available soon',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb'
    });
  }

  unlinkContent(contentId: string) {
    // To be implemented
    Swal.fire({
      title: 'Coming Soon',
      text: 'Content unlinking feature will be available soon',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb'
    });
  }
}