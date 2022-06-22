import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoachingComponent } from './create-coaching.component';

describe('CreateCoachingComponent', () => {
  let component: CreateCoachingComponent;
  let fixture: ComponentFixture<CreateCoachingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCoachingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCoachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
