import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (authService.isLoggedIn()) {
      <nav class="navbar">
        <div class="brand">EMS</div>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/employees" routerLinkActive="active">Employees</a>
        <div class="spacer"></div>
        <span class="user-info">{{ authService.currentUsername() }} ({{ authService.currentRole() }})</span>
        <button class="btn btn-secondary" (click)="logout()">Logout</button>
      </nav>
    }
    <main [class.with-nav]="authService.isLoggedIn()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      gap: 20px;
      background: #1e293b;
      color: #fff;
      padding: 12px 24px;
    }
    .brand { font-weight: 700; font-size: 18px; }
    .navbar a { color: #cbd5e1; text-decoration: none; font-size: 14px; }
    .navbar a.active, .navbar a:hover { color: #fff; font-weight: 600; }
    .spacer { flex: 1; }
    .user-info { font-size: 13px; color: #cbd5e1; }
    main.with-nav { padding: 24px; }
    main:not(.with-nav) { padding: 0; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
