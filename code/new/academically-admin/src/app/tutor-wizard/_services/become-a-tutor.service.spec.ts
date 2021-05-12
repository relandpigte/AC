import { TestBed } from '@angular/core/testing';

import { BecomeATutorService } from './become-a-tutor.service';

describe('BecomeATutorService', () => {
  let service: BecomeATutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BecomeATutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
