import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = '';
  showTooltip: boolean = false;
  showMessage: boolean = false;
  
  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (!this.validateEmail(this.email)) {
      this.showTooltip = true;    
      setTimeout(() => {
        this.showTooltip = false;
      }, 2000);

      return;
    }
    
    this.sendResetPasswordRequest(this.email);

    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 5000);
  }

  sendResetPasswordRequest(email: string): void {
    const apiUrl = 'http://localhost:8080/api/auth/forgot-password';
    this.http.post(apiUrl, { email }).subscribe((response) => {
      console.log(response);
    });
    return;
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
