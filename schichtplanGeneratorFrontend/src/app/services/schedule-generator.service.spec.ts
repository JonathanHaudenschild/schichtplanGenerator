import { TestBed } from '@angular/core/testing';

import { ScheduleGeneratorService } from './schedule-generator.service';

describe('ScheduleGeneratorService', () => {
  let service: ScheduleGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
