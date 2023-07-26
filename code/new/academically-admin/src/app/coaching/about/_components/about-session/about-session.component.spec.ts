import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSessionComponent } from './about-session.component';

describe('AboutSessionComponent', () => {
  let component: AboutSessionComponent;
  let fixture: ComponentFixture<AboutSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
