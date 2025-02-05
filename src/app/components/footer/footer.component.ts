import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">© 2024 Boss AI. All rights reserved.</p>
          <div class="space-x-4">
            <a href="#" class="text-sm text-gray-500 hover:text-primary">Privacy Policy</a>
            <a href="#" class="text-sm text-gray-500 hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}