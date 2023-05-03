import { TestBed } from '@angular/core/testing';

import { ShiftApiService } from './shift-api.service';

describe('ShiftApiService', () => {
  let service: ShiftApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
