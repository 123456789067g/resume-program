import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [],
  templateUrl: './payment-failure.component.html',
  styleUrl: './payment-failure.component.css'
})

export class PaymentFailureComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // 设置3秒延迟后跳转到mainpage
    setTimeout(() => {
      this.router.navigate(['/mainpage']);
    }, 3000);
  }

}