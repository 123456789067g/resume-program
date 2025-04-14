import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token = "";

  // Save token to localStorage
  setToken(token: string): void {
    localStorage.setItem(this.token, token);
  }

  // Retrieve token
  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  // Remove token (on logout)
  clearToken(): void {
    localStorage.removeItem(this.token);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
