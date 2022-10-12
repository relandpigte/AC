import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBroadcastComponent } from './create-broadcast.component';

describe('CreateBroadcastComponent', () => {
  let component: CreateBroadcastComponent;
  let fixture: ComponentFixture<CreateBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBroadcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
