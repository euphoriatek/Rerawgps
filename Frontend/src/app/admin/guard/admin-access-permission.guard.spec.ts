import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminAccessPermissionGuard } from './admin-access-permission.guard';

describe('adminAccessPermissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminAccessPermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
