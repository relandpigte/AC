import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPresentationMaterialComponent } from './upload-presentation-material.component';

describe('UploadPresentationMaterialComponent', () => {
  let component: UploadPresentationMaterialComponent;
  let fixture: ComponentFixture<UploadPresentationMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPresentationMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPresentationMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
