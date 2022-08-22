import { TestBed } from '@angular/core/testing';

import { PedroService } from './pedro.service';

describe('PedroService', () => {
  let service: PedroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
