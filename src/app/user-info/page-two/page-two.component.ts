import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: "app-page-two",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./page-two.component.html",
  styleUrls: ["./page-two.component.css"],
})
export class PageTwoComponent implements OnInit {
  form!: FormGroup;
  degreeOptions: string[] = [
    "ASSOCIATE",
    "BACHELOR",
    "DOCTORATE",
    "GED",
    "HIGH_SCHOOL",
    "MASTER",
    "MBA",
    "OTHER",
    "PHD",
    "SOME_COLLEGE",
    "VOCATIONAL",
  ];
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // ✅ 初始化表单并添加必填验证
    this.form = this.fb.group({
      educationHistory: this.fb.array([]), // ✅ 教育经历是一个 `FormArray`
    });

    // ✅ 只在浏览器环境下访问 sessionStorage
    if (typeof window !== "undefined" && window.sessionStorage) {
      const savedData = sessionStorage.getItem("pageTwo");
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.educationHistory?.length) {
          data.educationHistory.forEach(() => this.addEducationHistory());
          this.form.patchValue(data);
        }
      }
    }

    // ✅ 如果没有教育经历，默认添加一个空的
    if (this.educationHistory.controls.length === 0) {
      this.addEducationHistory();
    }
  }

  get educationHistory(): FormArray {
    return this.form.get("educationHistory") as FormArray;
  }

  addEducationHistory(): void {
    const eduForm = this.fb.group({
      university: ["", Validators.required],
      major: ["", Validators.required],
      degree: ["", Validators.required],
      degreeOther: [""],
      startDate: ["", Validators.required],
      graduateDate: ["", Validators.required],
      current: ["", Validators.required],
    });

    this.educationHistory.push(eduForm);
  }

  removeEducationHistory(index: number): void {
    if (this.educationHistory.length > 1) {
      this.educationHistory.removeAt(index);
    } else {
      alert("You must have at least one education history.");
    }
  }

  // ✅ 处理 "Previous" 按钮逻辑
  onPrevious(): void {
    this.router.navigate(["/user-info/page-one"]);    
  }

  // ✅ 处理 "Next" 按钮逻辑
  onNext(): void {
    if (this.form.valid) {
      // ✅ 表单数据存入 sessionStorage，确保刷新不会丢失
      sessionStorage.setItem("pageTwo", JSON.stringify(this.form.value));
      this.router.navigate(["/user-info/page-three"]);
    } else {
      alert("Please fill out all required fields before proceeding.");
    }
  }
}
