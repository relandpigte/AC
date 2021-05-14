import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLanguageSpokenComponent } from './edit-language-spoken.component';

describe('EditLanguageSpokenComponent', () => {
  let component: EditLanguageSpokenComponent;
  let fixture: ComponentFixture<EditLanguageSpokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLanguageSpokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLanguageSpokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
