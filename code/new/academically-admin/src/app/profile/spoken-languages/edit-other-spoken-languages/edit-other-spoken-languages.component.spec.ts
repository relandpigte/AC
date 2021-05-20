import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOtherSpokenLanguagesComponent } from './edit-other-spoken-languages.component';

describe('EditOtherSpokenLanguagesComponent', () => {
  let component: EditOtherSpokenLanguagesComponent;
  let fixture: ComponentFixture<EditOtherSpokenLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOtherSpokenLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOtherSpokenLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
