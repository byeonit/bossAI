import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  User,
  AuthError,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import {
  Product,
  MarketingContent,
  MarketingCampaign,
  CampaignAnalytics,
  UserCredentials,
  AuthResponse,
  ProductDescription,
} from '../types/supabase.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUser.next(session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  signUp(credentials: UserCredentials): Observable<AuthResponse> {
    return from(this.supabase.auth.signUp(credentials)).pipe(
      map(({ data, error }) => ({
        user: data.user,
        error: error,
      }))
    );
  }

  signIn(credentials: UserCredentials): Observable<AuthResponse> {
    return from(this.supabase.auth.signInWithPassword(credentials)).pipe(
      map(({ data, error }) => ({
        user: data.user,
        error: error,
      }))
    );
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  // Marketing Content Methods
  addMarketingContent(
    title: string,
    description: string
  ): Observable<MarketingContent> {
    return from(
      this.supabase
        .from('marketing_content')
        .insert([
          {
            title,
            description,
            user_id: this.currentUser.value?.id,
          },
        ])
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingContent;
      })
    );
  }

  getMarketingContent(): Observable<MarketingContent[]> {
    return from(
      this.supabase
        .from('marketing_content')
        .select('*')
        .eq('user_id', this.currentUser.value?.id)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingContent[];
      })
    );
  }

  searchMarketingContent(query: string): Observable<MarketingContent[]> {
    if (!query.trim()) {
      return this.getMarketingContent();
    }

    const searchTerm = `%${query.trim()}%`;

    return from(
      this.supabase
        .from('marketing_content')
        .select('*')
        .eq('user_id', this.currentUser.value?.id)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingContent[];
      }),
      catchError((error) => {
        console.error('Error searching marketing content:', error);
        throw error;
      })
    );
  }

  async getPaginatedMarketingContent(
    page: number,
    pageSize: number
  ): Promise<{ data: MarketingContent[]; count: number }> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, count, error } = await this.supabase
        .from('marketing_content')
        .select('*', { count: 'exact' })
        .eq('user_id', this.currentUser.value?.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: data as MarketingContent[],
        count: count || 0,
      };
    } catch (error) {
      console.error('Error fetching paginated content:', error);
      throw error;
    }
  }

  updateMarketingContent(
    id: string,
    title: string,
    description: string
  ): Observable<MarketingContent> {
    return from(
      this.supabase
        .from('marketing_content')
        .update({ title, description })
        .eq('id', id)
        .eq('user_id', this.currentUser.value?.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingContent;
      })
    );
  }

  deleteMarketingContent(id: string): Observable<void> {
    console.log(`Attempting to delete marketing content with ID: ${id}`);

    if (!id) {
      return throwError(() => new Error('Content ID is required'));
    }

    return from(
      this.supabase
        .from('marketing_content')
        .delete()
        .eq('id', id)
        .eq('user_id', this.currentUser.value?.id)
    ).pipe(
      map(({ error, count }) => {
        if (error) throw error;
        console.log(`Successfully deleted ${count} marketing content items`);
        if (count === 0) {
          throw new Error(
            'No content was deleted. Content may not exist or you may not have permission.'
          );
        }
      }),
      catchError((error) => {
        console.error('Error deleting marketing content:', error);
        throw error;
      })
    );
  }

  // Marketing Campaigns Methods
  async getPaginatedCampaigns(
    page: number,
    pageSize: number
  ): Promise<{ data: MarketingCampaign[]; count: number }> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    console.log('Fetching campaigns with params:', { page, pageSize, from, to });
    console.log('Current user:', this.currentUser.value?.id);

    try {
      const { data, count, error } = await this.supabase
        .from('marketing_campaigns')
        .select('*', { count: 'exact' })
        .eq('user_id', this.currentUser.value?.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched campaigns:', { data, count });

      return {
        data: data as MarketingCampaign[],
        count: count || 0,
      };
    } catch (error) {
      console.error('Error fetching paginated campaigns:', error);
      throw error;
    }
  }

  addCampaign(campaign: {
    campaign_name: string;
    target_audience: string;
    budget: number;
    start_date: string;
    end_date: string;
  }): Observable<MarketingCampaign> {
    return from(
      this.supabase
        .from('marketing_campaigns')
        .insert([
          {
            ...campaign,
            user_id: this.currentUser.value?.id,
          },
        ])
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingCampaign;
      })
    );
  }

  updateCampaign(campaign: MarketingCampaign): Observable<MarketingCampaign> {
    return from(
      this.supabase
        .from('marketing_campaigns')
        .update({
          campaign_name: campaign.campaign_name,
          target_audience: campaign.target_audience,
          budget: campaign.budget,
          start_date: campaign.start_date,
          end_date: campaign.end_date
        })
        .eq('id', campaign.id)
        .eq('user_id', this.currentUser.value?.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingCampaign;
      })
    );
  }

  deleteCampaign(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Campaign ID is required'));
    }

    console.log('Deleting campaign:', id);
    console.log('Current user:', this.currentUser.value?.id);

    return from(
      this.supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', id)
        .eq('user_id', this.currentUser.value?.id)
    ).pipe(
      tap(response => console.log('Delete response:', response)),
      map(({ error, count }) => {
        if (error) throw error;
        if (count === 0) {
          throw new Error(
            'No campaign was deleted. Campaign may not exist or you may not have permission.'
          );
        }
      }),
      catchError((error) => {
        console.error('Error deleting campaign:', error);
        throw error;
      })
    );
  }

  getCampaignDetails(campaignId: string): Observable<MarketingCampaign> {
    return from(
      this.supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MarketingCampaign;
      })
    );
  }

  getCampaignContent(campaignId: string): Observable<MarketingContent[]> {
    return from(
      this.supabase
        .from('campaign_content')
        .select('content_id')
        .eq('campaign_id', campaignId)
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) throw error;
        if (!data?.length) return of([]);

        const contentIds = data.map(entry => entry.content_id);
        return from(
          this.supabase
            .from('marketing_content')
            .select('*')
            .in('id', contentIds)
        ).pipe(
          map(({ data: contentData, error: contentError }) => {
            if (contentError) throw contentError;
            return contentData as MarketingContent[];
          })
        );
      })
    );
  }

  // New Analytics Methods
  getCampaignAnalytics(campaignId: string, startDate?: string, endDate?: string): Observable<CampaignAnalytics[]> {
    let query = this.supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('date', { ascending: true });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as CampaignAnalytics[];
      })
    );
  }

  getCampaignAnalyticsSummary(campaignId: string): Observable<{
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    avg_engagement_rate: number;
  }> {
    return this.getCampaignAnalytics(campaignId).pipe(
      map(analytics => {
        const summary = analytics.reduce((acc, curr) => ({
          total_impressions: acc.total_impressions + curr.impressions,
          total_clicks: acc.total_clicks + curr.clicks,
          total_conversions: acc.total_conversions + curr.conversions,
          avg_engagement_rate: acc.avg_engagement_rate + curr.engagement_rate
        }), {
          total_impressions: 0,
          total_clicks: 0,
          total_conversions: 0,
          avg_engagement_rate: 0
        });

        if (analytics.length > 0) {
          summary.avg_engagement_rate /= analytics.length;
        }

        return summary;
      })
    );
  }

  // Get all product descriptions
  getProductDescriptions(): Observable<ProductDescription[]> {
    return from(
      this.supabase
        .from('product_descriptions')
        .select('*')
        .eq('user_id', this.currentUser.value?.id)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ProductDescription[];
      })
    );
  }

  // Add a new product description
  addProductDescription(
    name: string,
    details: string,
    generatedDescription: string,
    tone: string
  ): Observable<ProductDescription> {
    return from(
      this.supabase
        .from('product_descriptions')
        .insert([
          {
            name,
            details,
            generated_description: generatedDescription,
            tone,
            user_id: this.currentUser.value?.id,
          },
        ])
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ProductDescription;
      })
    );
  }
}