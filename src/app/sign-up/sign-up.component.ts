import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      password2: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value;
      if (formData.password !== formData.password2) {
        this.errorMessage = 'Passwords do not match';
        return;
      }
      formData.username = formData.email; // Set username to be the same as email
      this.http.post(`${environment.baseApiUrl}/api/auth/signup`, formData)
        .subscribe((response: any) => {
          console.log('Registration successful', response);
          if (response.success) {
            console.log('Registration successful');
            alert('Registration successful');
            this.router.navigate(['/sign-in']);
          } else {
            console.log('Registration failed', response.message);
            this.errorMessage = response.message;
            alert(this.errorMessage);
          }
        }, response => {
          console.error('Registration failed', response);
          const error = response.error;
          this.errorMessage = error.message || 'Registration failed';
          alert(this.errorMessage);
        });
    }
  }
}
