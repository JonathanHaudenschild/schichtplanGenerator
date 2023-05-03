import { TestBed } from '@angular/core/testing';

import { ParticipantApiService } from './participant-api.service';

describe('ParticipantApiService', () => {
  let service: ParticipantApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
