import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSpokenComponent } from './language-spoken.component';

describe('LanguageSpokenComponent', () => {
  let component: LanguageSpokenComponent;
  let fixture: ComponentFixture<LanguageSpokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSpokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSpokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
