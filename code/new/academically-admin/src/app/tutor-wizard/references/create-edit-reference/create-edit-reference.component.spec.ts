import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditReferenceComponent } from './create-edit-reference.component';

describe('CreateEditReferenceComponent', () => {
  let component: CreateEditReferenceComponent;
  let fixture: ComponentFixture<CreateEditReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
