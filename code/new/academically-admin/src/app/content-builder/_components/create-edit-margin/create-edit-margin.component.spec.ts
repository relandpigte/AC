import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditMarginComponent } from './create-edit-margin.component';

describe('CreateEditMarginComponent', () => {
  let component: CreateEditMarginComponent;
  let fixture: ComponentFixture<CreateEditMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditMarginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
