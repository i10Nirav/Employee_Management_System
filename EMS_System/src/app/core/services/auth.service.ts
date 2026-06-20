import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models/models';

const API_URL = 'https://localhost:5001/api/auth';
const TOKEN_KEY = 'ems_token';
const ROLE_KEY = 'ems_role';
const USERNAME_KEY = 'ems_username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Reactive signals so the UI (e.g. nav bar) can react to login/logout instantly
  currentUsername = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  currentRole = signal<string | null>(localStorage.getItem(ROLE_KEY));

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, request).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this.currentUsername.set(null);
    this.currentRole.set(null);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(ROLE_KEY, res.role);
    localStorage.setItem(USERNAME_KEY, res.username);
    this.currentUsername.set(res.username);
    this.currentRole.set(res.role);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentRole() === 'Admin';
  }
}
