import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AddMarketingComponent } from './components/marketing/add-marketing.component';
import { AddMarketingCampaignsComponent } from './components/marketing/add-marketing-campaigns.component';
import { ContentListComponent } from './pages/content-list/content-list.component';
import { HomeComponent } from './pages/home/home.component';
import { CampaignsComponent } from './pages/campaigns/campaigns.component';
import { CampaignDetailsComponent } from './pages/campaign-details/campaign-details.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { CampaignEditComponent } from './pages/campaign-edit/campaign-edit.component';
import { CampaignAnalyticsComponent } from './pages/campaign-analytics/campaign-analytics.component';
import { ProductSeoComponent } from './pages/product-seo/product-seo.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'content', component: ContentListComponent },
      { path: 'campaigns', component: CampaignsComponent },
      { path: 'campaigns/:id', component: CampaignDetailsComponent },
      { path: 'campaigns/:id/edit', component: CampaignEditComponent },
      { path: 'campaigns/:id/analytics', component: CampaignAnalyticsComponent },
      { path: 'add-marketing', component: AddMarketingComponent },
      { path: 'add-campaign', component: AddMarketingCampaignsComponent },
      { path: 'product-seo', component: ProductSeoComponent }
    ]
  }
];