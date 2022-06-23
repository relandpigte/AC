import { TestBed } from '@angular/core/testing';

import { CoachingService } from './coaching.service';

describe('CoachingService', () => {
  let service: CoachingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
