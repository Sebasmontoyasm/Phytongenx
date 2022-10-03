import { TestBed } from '@angular/core/testing';

import { CheckSinginGuard } from './check-singin.guard';

describe('CheckSinginGuard', () => {
  let guard: CheckSinginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckSinginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
