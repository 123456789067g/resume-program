import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.css'],
})
export class PageOneComponent implements OnInit {
  form!: FormGroup;
  showError: boolean = false; // 控制错误信息的显示

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      street1: ['', Validators.required],
      street2: [''],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required]
    });

    // ✅ 只在浏览器环境下访问 `sessionStorage`
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const savedData = sessionStorage.getItem('pageOne');
      if (savedData) {
        this.form.patchValue(JSON.parse(savedData));
      }
    }
  }

  onNext(): void {
    if (this.form.valid) {
      sessionStorage.setItem('startedSurvey', 'true'); // ✅ 标记问卷已开始
      sessionStorage.setItem('pageOne', JSON.stringify(this.form.value)); // ✅ 存储数据
      this.router.navigate(['/user-info/page-two']); // ✅ 跳转到 Page Two
    } else {
      this.showError = true; // 显示错误信息
    }
  }
}
