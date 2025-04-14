import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  email: string = '';
  isValidToken: boolean | null = null;
  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || '';
      this.email = params.get('email') || '';

      if (!this.token || !this.email) {
        this.router.navigate(['/mainpage']);
        return;
      }
      
      this.verifyToken(this.token, this.email);
    });
  }

  verifyToken(token: string, email: string) {
    const apiUrl = 'http://localhost:8080/api/auth/verify-token?token=' + token + '&email=' + email;
    this.http.get(apiUrl, { observe: 'response' }).subscribe((response) => {
      if (response.ok) {
        this.isValidToken = true;
      } else {
        this.isValidToken = false;
        this.router.navigate(['/invalid-token']);
      }
    },
    (error) => {      
      this.isValidToken = false;
      this.router.navigate(['/invalid-token']);
    }
  )};


  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
  
  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    const password = this.resetForm.get('password')?.value;    
    const apiUrl = 'http://localhost:8080/api/auth/reset-password?token=' + this.token;    
    this.http
      .post<{ success: boolean }>(apiUrl, {
        userId: this.email,
        newPassword: password,
        confirmPassword: password,
      })
      .subscribe(
        (response) => {
          if (response.success) {
            this.router.navigate(['/sign-in']);
          } else {            
            alert('Unable to reset password. Please try again.');
          }
        },
        (error) => {          
          alert('An error occurred. Please try again later.');
        }
      );
  }
}
