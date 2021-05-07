import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestServiceSubjectComponent } from './suggest-service-subject.component';

describe('SuggestServiceSubjectComponent', () => {
  let component: SuggestServiceSubjectComponent;
  let fixture: ComponentFixture<SuggestServiceSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestServiceSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestServiceSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
