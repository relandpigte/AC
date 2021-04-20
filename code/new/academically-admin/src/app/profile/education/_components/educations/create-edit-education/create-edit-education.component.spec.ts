import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditEducationComponent } from './create-edit-education.component';

describe('CreateEditEducationComponent', () => {
  let component: CreateEditEducationComponent;
  let fixture: ComponentFixture<CreateEditEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
