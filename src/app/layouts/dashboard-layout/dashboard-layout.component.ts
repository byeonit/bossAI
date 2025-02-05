import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-100 flex">
      <app-sidebar />
      <div class="flex-1 lg:ml-64">
        <div class="py-20 px-4 sm:px-6 lg:px-8">
          <router-outlet />
        </div>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {}