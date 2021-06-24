import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSessionComponent } from './create-edit-session.component';

describe('CreateEditSessionComponent', () => {
  let component: CreateEditSessionComponent;
  let fixture: ComponentFixture<CreateEditSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
