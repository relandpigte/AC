import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRelatedCoachingComponent } from './about-related-coaching.component';

describe('AboutRelatedCoachingComponent', () => {
  let component: AboutRelatedCoachingComponent;
  let fixture: ComponentFixture<AboutRelatedCoachingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutRelatedCoachingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutRelatedCoachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
