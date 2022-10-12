import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHandoutComponent } from './upload-handout.component';

describe('UploadHandoutComponent', () => {
  let component: UploadHandoutComponent;
  let fixture: ComponentFixture<UploadHandoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHandoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHandoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
