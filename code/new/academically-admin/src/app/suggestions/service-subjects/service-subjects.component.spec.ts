import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSubjectsComponent } from './service-subjects.component';

describe('ServiceSubjectsComponent', () => {
  let component: ServiceSubjectsComponent;
  let fixture: ComponentFixture<ServiceSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
