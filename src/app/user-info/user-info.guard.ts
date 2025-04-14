// src/app/user-info/user-info.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const userInfoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 检查是否在浏览器环境中，防止 SSR 报错
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    // 在服务器环境下直接放行
    return true;
  }

  // 检查 sessionStorage 是否标记用户已访问 page-one
  const startedSurvey = sessionStorage.getItem('startedSurvey') === 'true';

  if (!startedSurvey) {
    // 如果没有从 page-one 开始，跳转回 page-one
    router.navigate(['/user-info/page-one']);
    return false;
  }

  return true; // 已访问 page-one，则放行
};
