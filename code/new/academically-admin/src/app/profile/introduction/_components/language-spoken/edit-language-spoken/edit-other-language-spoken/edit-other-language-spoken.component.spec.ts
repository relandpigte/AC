import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOtherLanguageSpokenComponent } from './edit-other-language-spoken.component';

describe('EditOtherLanguageSpokenComponent', () => {
  let component: EditOtherLanguageSpokenComponent;
  let fixture: ComponentFixture<EditOtherLanguageSpokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOtherLanguageSpokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOtherLanguageSpokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
