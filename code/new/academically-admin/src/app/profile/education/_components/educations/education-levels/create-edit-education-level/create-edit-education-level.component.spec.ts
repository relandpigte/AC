import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditEducationLevelComponent } from './create-edit-education-level.component';

describe('CreateEditEducationLevelComponent', () => {
  let component: CreateEditEducationLevelComponent;
  let fixture: ComponentFixture<CreateEditEducationLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditEducationLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEducationLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
