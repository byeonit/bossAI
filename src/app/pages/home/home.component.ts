import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-primary">Boss AI</h1>
            </div>
            <div class="flex items-center">
              <a
                routerLink="/login"
                class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block">Transform Your Marketing</span>
            <span class="block text-primary">with AI-Powered Insights</span>
          </h2>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Boss AI helps you create, manage, and optimize your marketing content with the power of artificial intelligence.
            Streamline your workflow and boost your marketing effectiveness.
          </p>
          <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div class="rounded-md shadow">
              <a
                routerLink="/signup"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </a>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#features"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div id="features" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold text-gray-900">
              Powerful Features for Modern Marketing
            </h2>
            <p class="mt-4 text-lg text-gray-500">
              Everything you need to take your marketing strategy to the next level
            </p>
          </div>

          <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1 -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">AI-Powered Content Creation</h3>
                <p class="mt-2 text-base text-gray-500">
                  Generate engaging marketing content with advanced AI algorithms tailored to your brand.
                </p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                <p class="mt-2 text-base text-gray-500">
                  Track and analyze your marketing performance with real-time insights and metrics.
                </p>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">Campaign Management</h3>
                <p class="mt-2 text-base text-gray-500">
                  Organize and manage your marketing campaigns efficiently in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}