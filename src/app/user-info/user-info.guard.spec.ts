import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userInfoGuard } from './user-info.guard';

describe('userInfoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userInfoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
