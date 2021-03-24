import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPassportComponent } from './verify-passport.component';

describe('VerifyPassportComponent', () => {
  let component: VerifyPassportComponent;
  let fixture: ComponentFixture<VerifyPassportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPassportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
