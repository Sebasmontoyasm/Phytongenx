import { TestBed } from '@angular/core/testing';

import { RpaService } from './rpa.service';

describe('RpaService', () => {
  let service: RpaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RpaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
