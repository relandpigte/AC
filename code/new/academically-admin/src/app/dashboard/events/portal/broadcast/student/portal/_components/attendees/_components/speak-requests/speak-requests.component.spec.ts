import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakRequestsComponent } from './speak-requests.component';

describe('SpeakRequestsComponent', () => {
  let component: SpeakRequestsComponent;
  let fixture: ComponentFixture<SpeakRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
