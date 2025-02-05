import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.supabaseService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}