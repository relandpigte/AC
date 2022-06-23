import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoutsComponent } from './handouts.component';

describe('HandoutsComponent', () => {
  let component: HandoutsComponent;
  let fixture: ComponentFixture<HandoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
