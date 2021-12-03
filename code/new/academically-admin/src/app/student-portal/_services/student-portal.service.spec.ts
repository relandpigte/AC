import { TestBed } from '@angular/core/testing';

import { StudentPortalService } from './student-portal.service';

describe('StudentPortalService', () => {
  let service: StudentPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
