import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerImageComponentEditorComponent } from './banner-image-component-editor.component';

describe('BannerImageComponentEditorComponent', () => {
  let component: BannerImageComponentEditorComponent;
  let fixture: ComponentFixture<BannerImageComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerImageComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerImageComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
