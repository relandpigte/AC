import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditServiceComponent } from './create-edit-service.component';

describe('CreateEditServiceComponent', () => {
  let component: CreateEditServiceComponent;
  let fixture: ComponentFixture<CreateEditServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
