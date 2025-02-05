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
            <div class="flex space-x-4">
              <button
                (click)="viewAnalytics()"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View Analytics
              </button>
              <button
                (click)="editCampaign()"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Edit Campaign
              </button>
            </div>
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

          <!-- Performance Metrics Section -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900">Performance Metrics</h2>
                <button
                  (click)="viewAnalytics()"
                  class="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  View Detailed Analytics →
                </button>
              </div>
            </div>
            <div class="px-6 py-5">
              <div *ngIf="analyticsSummary" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Total Impressions</p>
                  <p class="mt-1 text-2xl font-semibold text-gray-900">
                    {{ analyticsSummary.total_impressions | number }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Total Clicks</p>
                  <p class="mt-1 text-2xl font-semibold text-gray-900">
                    {{ analyticsSummary.total_clicks | number }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Total Conversions</p>
                  <p class="mt-1 text-2xl font-semibold text-gray-900">
                    {{ analyticsSummary.total_conversions | number }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Avg. Engagement Rate</p>
                  <p class="mt-1 text-2xl font-semibold text-gray-900">
                    {{ analyticsSummary.avg_engagement_rate | percent:'1.2' }}
                  </p>
                </div>
              </div>
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
  analyticsSummary: {
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    avg_engagement_rate: number;
  } | null = null;

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

    console.log('Loading campaign details for ID:', campaignId);

    this.supabaseService.getCampaignDetails(campaignId).pipe(
      catchError(error => {
        console.error('Error fetching campaign:', error);
        throw new Error('Failed to load campaign details');
      }),
      switchMap(campaign => {
        console.log('Campaign loaded:', campaign);
        return forkJoin({
          campaign: of(campaign),
          analytics: this.supabaseService.getCampaignAnalyticsSummary(campaignId).pipe(
            catchError(error => {
              console.error('Error fetching analytics:', error);
              return of({
                total_impressions: 0,
                total_clicks: 0,
                total_conversions: 0,
                avg_engagement_rate: 0
              });
            })
          )
        });
      })
    ).subscribe({
      next: ({ campaign, analytics }) => {
        console.log('Data loaded successfully:', { campaign, analytics });
        this.campaign = campaign;
        this.analyticsSummary = analytics;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in subscription:', error);
        this.error = error.message || 'Failed to load campaign details';
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

  viewAnalytics() {
    if (this.campaign) {
      this.router.navigate(['/campaigns', this.campaign.id, 'analytics']);
    }
  }
}