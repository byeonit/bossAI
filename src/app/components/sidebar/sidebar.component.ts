import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="bg-white h-full w-64 fixed left-0 top-16 shadow-sm lg:block hidden">
      <nav class="mt-5 px-2">
        <a
          routerLink="/content"
          routerLinkActive="bg-primary text-white"
          class="group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-primary hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Marketing Content
        </a>

        <a
          routerLink="/campaigns"
          routerLinkActive="bg-primary text-white"
          class="mt-1 group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-primary hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Marketing Campaigns
        </a>
      </nav>
    </aside>

    <!-- Mobile Sidebar -->
    <div class="lg:hidden">
      <div class="fixed inset-0 flex z-40">
        <aside class="relative flex-1 flex flex-col w-64 bg-white">
          <nav class="mt-5 px-2">
            <a
              routerLink="/content"
              routerLinkActive="bg-primary text-white"
              class="group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-primary hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Marketing Content
            </a>

            <a
              routerLink="/campaigns"
              routerLinkActive="bg-primary text-white"
              class="mt-1 group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-primary hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Marketing Campaigns
            </a>
          </nav>
        </aside>
      </div>
    </div>
  `
})
export class SidebarComponent {}