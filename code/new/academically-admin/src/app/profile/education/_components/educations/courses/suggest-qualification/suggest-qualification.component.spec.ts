import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestQualificationComponent } from './suggest-qualification.component';

describe('SuggestQualificationComponent', () => {
  let component: SuggestQualificationComponent;
  let fixture: ComponentFixture<SuggestQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
