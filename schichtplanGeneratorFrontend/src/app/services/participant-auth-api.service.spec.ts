import { TestBed } from '@angular/core/testing';

import { ParticipantAuthApiService } from './participant-auth-api.service';

describe('ParticipantAuthApiService', () => {
  let service: ParticipantAuthApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantAuthApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
