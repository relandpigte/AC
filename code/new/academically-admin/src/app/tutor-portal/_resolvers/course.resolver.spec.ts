import { TestBed } from '@angular/core/testing';

import { CourseResolver } from './course.resolver';

describe('ProfileResolver', () => {
  let resolver: CourseResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CourseResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
