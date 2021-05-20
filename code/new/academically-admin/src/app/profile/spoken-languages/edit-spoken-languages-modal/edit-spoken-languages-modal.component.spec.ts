import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpokenLanguageModalComponent } from './edit-spoken-languages-modal.component';

describe('EditSpokenLanguageModalComponent', () => {
  let component: EditSpokenLanguageModalComponent;
  let fixture: ComponentFixture<EditSpokenLanguageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSpokenLanguageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpokenLanguageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
