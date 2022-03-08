import { TestBed } from '@angular/core/testing';

import { StudentPortalRouteGuard } from './student-portal-route.guard';

describe('StudentPortalRouteGuard', () => {
  let guard: StudentPortalRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StudentPortalRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
