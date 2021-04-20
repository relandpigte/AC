import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditInterestComponent } from './create-edit-interest.component';

describe('CreateEditInterestComponent', () => {
  let component: CreateEditInterestComponent;
  let fixture: ComponentFixture<CreateEditInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
