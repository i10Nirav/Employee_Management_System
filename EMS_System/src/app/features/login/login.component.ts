import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrap">
      <form class="card login-card" (ngSubmit)="onSubmit()">
        <h2>Employee Management System</h2>
        <p class="subtitle">Sign in to continue</p>

        <label>Username</label>
        <input type="text" name="username" [(ngModel)]="username" required autofocus />

        <label>Password</label>
        <input type="password" name="password" [(ngModel)]="password" required />

        @if (error()) {
          <div class="error">{{ error() }}</div>
        }

        <button type="submit" class="btn btn-primary" [disabled]="loading()">
          {{ loading() ? 'Signing in...' : 'Login' }}
        </button>

        <p class="hint">Default admin: <strong>admin</strong> / <strong>Admin&#64;123</strong></p>
      </form>
    </div>
  `,
  styles: [`
    .login-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #2563eb, #1e3a8a);
    }
    .login-card {
      width: 360px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    h2 { margin: 0; font-size: 20px; }
    .subtitle { margin: 0 0 10px; color: #6b7280; font-size: 13px; }
    label { font-size: 13px; font-weight: 600; margin-top: 6px; }
    .error { color: #dc2626; font-size: 13px; }
    .hint { font-size: 12px; color: #9ca3af; margin-top: 8px; text-align: center; }
    button { margin-top: 10px; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }
}
