import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-three',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-three.component.html',
  styleUrls: ['./page-three.component.css'],
})
export class PageThreeComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      workingHistory: this.fb.array([]) // ✅ 工作经历是一个 `FormArray`
    });

    // ✅ 只在浏览器环境下访问 sessionStorage，防止 SSR 报错
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const savedData = sessionStorage.getItem('pageThree');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.workingHistory?.length) {
          data.workingHistory.forEach(() => this.addWorkExperience());
          this.form.patchValue(data);
        }
      }
    }

    // ✅ 如果没有工作经历，默认添加一个空的
    if (this.workingHistory.controls.length === 0) {
      this.addWorkExperience();
    }
  }

  // ✅ 获取工作经历的 FormArray
  get workingHistory(): FormArray {
    return this.form.get('workingHistory') as FormArray;
  }

  // ✅ 添加一个新的工作经历
  addWorkExperience(): void {
    const workForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]], // ✅ 限制描述最多 1000 字
      current: ['', Validators.required]
    });

    workForm.get('current')?.valueChanges.subscribe((value) => {
      const endDateControl = workForm.get('endDate');
      if (value === 'yes') {
        endDateControl?.clearValidators();
      } else {
        endDateControl?.setValidators(Validators.required);
      }
      endDateControl?.updateValueAndValidity();
    }
  )

    this.workingHistory.push(workForm);
  }

  // ✅ 删除某个工作经历
  removeWorkExperience(index: number): void {
    if (this.workingHistory.length > 1) {
      this.workingHistory.removeAt(index);
    } else {``
      alert('You must have at least one work experience entry.');
    }
  }

  // ✅ 处理 "Previous" 按钮逻辑
  onPrevious(): void {
    this.router.navigate(['/user-info/page-two']);
  }

  // ✅ 处理 "Next" 按钮逻辑
  onNext(): void {
    if (this.form.valid) {
      sessionStorage.setItem('pageThree', JSON.stringify(this.form.value));
      this.router.navigate(['/user-info/page-four']);
    } else {
      alert('Please fill out all required fields before proceeding.');
    }
  }
}
