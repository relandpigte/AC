import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBlockOutComponent } from './create-edit-block-out.component';

describe('CreateEditBlockOutComponent', () => {
  let component: CreateEditBlockOutComponent;
  let fixture: ComponentFixture<CreateEditBlockOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditBlockOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditBlockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
