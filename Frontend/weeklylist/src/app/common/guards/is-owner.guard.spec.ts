import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isOwnerGuard } from './is-owner.guard';

describe('isOwnerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isOwnerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
