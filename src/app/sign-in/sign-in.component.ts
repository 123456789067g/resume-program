import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { environment } from "../../environments/environment";
declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleSDK();
      this.loadFacebookSDK();
      (window as any).checkLoginState = this.checkLoginState.bind(this);
    }
  }

  loadGoogleSDK(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google API script loaded');
      this.initializeGoogleSignIn();
    };
    document.body.appendChild(script);
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '338799070138-v6dthhklf6rjf19kvaib84mhflrk3hgr.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById('g_id_onload'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any): void {
    const credential = response.credential;
    console.log("Encoded JWT ID token: " + credential);

    this.http.post(`${environment.baseApiUrl}/api/auth/oauth2/google`, { credential })
      .subscribe((res: any) => {
        console.log('Login successful, response', res);
        const token = `${res.tokenType} ${res.accessToken}`;
        if (token) {
          console.log('Login successful');
          alert(`Login successful by google login. Token: ${token}`);
          this.router.navigate(['/']);
        } else {
          console.error('Login failed');
          alert('Login failed');
        }
      }, error => {
        console.error('Error:', error);
      });
  }

  loadFacebookSDK(): void {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Facebook SDK loaded');
      this.initializeFacebookSignIn();
    };
    document.body.appendChild(script);
  }

  initializeFacebookSignIn(): void {
    FB.init({
      appId: '1193425945222630',
      cookie: true,
      xfbml: true,
      version: 'v20.0'
    });
    console.log('Facebook SDK initialized');
  }

  checkLoginState(): void {
    FB.getLoginStatus((response: any) => {
      console.log('Facebook login status:', response);
      this.statusChangeCallback(response);
    });
  }

  statusChangeCallback(response: any): void {
    if (response.status === 'connected') {
      const accessToken = response.authResponse.accessToken;
      console.log('Facebook access token:', accessToken);

      this.http.post(`${environment.baseApiUrl}/api/auth/oauth2/facebook`, { accessToken })
        .subscribe((res: any) => {
          console.log('Login successful, response', res);
          const token = `${res.tokenType} ${res.accessToken}`;
          if (token) {
            alert(`Login successful by facebook login. Token: ${token}`);
            this.router.navigate(['/']);
          } else {
            console.error('Login failed');
            alert('Login failed');
          }
        }, error => {
          console.error('Error:', error);
        });
    } else {
      console.log('User is not logged in.');
    }
  }

  onSubmit(): void {
    console.log('Form submitted', this.signInForm.value);
    if (this.signInForm.valid) {
      const formData = this.signInForm.value;
      formData.usernameOrEmail = formData.email;
      this.http.post(`${environment.baseApiUrl}/api/auth/signin`, formData)
        .subscribe((response: any) => {
          console.log('Login successful, response', response);
          const token = `${response.tokenType} ${response.accessToken}`;
          console.log('Login successful, token:', token);
          alert('Login successful, token: ' + token);
          if (token) {
            this.authService.setToken(token);
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message;
          }
        }, response => {
          console.error('Login failed', response);
          const error = response.error;
          this.errorMessage = error.message || 'Login failed';
          alert(this.errorMessage);
        });
    }
  }
}
