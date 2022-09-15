import { TestBed } from '@angular/core/testing';

import { UserlogService } from './userlog.service';

describe('UserlogService', () => {
  let service: UserlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
