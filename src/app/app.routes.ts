import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { PricingComponent } from './pricing/pricing.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { userInfoGuard } from './user-info/user-info.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InvalidTokenComponent } from './invalid-token/invalid-token.component';
export const routes: Routes = [
  { path: '', component: HomepageComponent }, // 默认指向 HomepageComponent
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'invalid-token', component: InvalidTokenComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'payment-failure', component: PaymentFailureComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'user-info',
    loadComponent: () => import('./user-info/user-info.component').then(m => m.UserInfoComponent),
    children: [
      { path: 'page-one', loadComponent: () => import('./user-info/page-one/page-one.component').then(m => m.PageOneComponent) },
      { path: 'page-two', loadComponent: () => import('./user-info/page-two/page-two.component').then(m => m.PageTwoComponent), canActivate: [userInfoGuard] },
      { path: 'page-three', loadComponent: () => import('./user-info/page-three/page-three.component').then(m => m.PageThreeComponent), canActivate: [userInfoGuard] },
      { path: 'page-four', loadComponent: () => import('./user-info/page-four/page-four.component').then(m => m.PageFourComponent), canActivate: [userInfoGuard] },
      { path: '', redirectTo: 'page-one', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/mainpage' }, // 处理不存在的路径
];
