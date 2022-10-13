import { TestBed } from '@angular/core/testing';

import { PortalPollService } from './portal-poll.service';

describe('PortalPollService', () => {
  let service: PortalPollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalPollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
