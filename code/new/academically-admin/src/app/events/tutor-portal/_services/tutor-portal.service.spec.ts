import { TestBed } from '@angular/core/testing';

import { TutorPortalService } from './tutor-portal.service';

describe('TutorPortalService', () => {
  let service: TutorPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
