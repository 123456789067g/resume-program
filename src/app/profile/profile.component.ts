import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    plan: ''
  };

  constructor(private router: Router) { }

  // 保存用户信息（可以与后端服务进行交互）
  saveProfile() {
    console.log('Profile saved:', this.user);
    // 在这里可以调用后端API来保存用户数据
  }

  // 返回上一页
  goBack() {
    this.router.navigate(['/mainpage']);
  }
}
