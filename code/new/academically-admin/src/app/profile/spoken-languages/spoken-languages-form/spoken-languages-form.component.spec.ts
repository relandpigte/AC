import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpokenLanguagesComponent } from './spoken-languages-form.component';

describe('SpokenLanguagesComponent', () => {
  let component: SpokenLanguagesComponent;
  let fixture: ComponentFixture<SpokenLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpokenLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpokenLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
