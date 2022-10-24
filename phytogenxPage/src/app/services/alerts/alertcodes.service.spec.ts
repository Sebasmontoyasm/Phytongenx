import { TestBed } from '@angular/core/testing';

import { AlertcodesService } from './alertcodes.service';

describe('AlertcodesService', () => {
  let service: AlertcodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertcodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
