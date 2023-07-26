import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutLearnComponent } from './about-learn.component';

describe('AboutLearnComponent', () => {
  let component: AboutLearnComponent;
  let fixture: ComponentFixture<AboutLearnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutLearnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
