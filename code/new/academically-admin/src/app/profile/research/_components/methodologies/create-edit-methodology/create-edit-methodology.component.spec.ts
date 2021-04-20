import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditMethodologyComponent } from './create-edit-methodology.component';

describe('CreateEditMethodologyComponent', () => {
  let component: CreateEditMethodologyComponent;
  let fixture: ComponentFixture<CreateEditMethodologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditMethodologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditMethodologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
