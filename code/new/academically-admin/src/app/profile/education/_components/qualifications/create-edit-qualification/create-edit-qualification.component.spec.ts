import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditQualificationComponent } from './create-edit-qualification.component';

describe('CreateEditQualificationComponent', () => {
  let component: CreateEditQualificationComponent;
  let fixture: ComponentFixture<CreateEditQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
