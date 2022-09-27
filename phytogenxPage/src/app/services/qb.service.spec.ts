import { TestBed } from '@angular/core/testing';

import { QbService } from './qb.service';

describe('QbService', () => {
  let service: QbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
