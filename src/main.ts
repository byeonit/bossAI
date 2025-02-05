import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { routes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header />
      <router-outlet />
      <app-footer />
    </div>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));