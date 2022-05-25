import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadComponentEditorComponent } from './download-component-editor.component';

describe('DownloadComponentEditorComponent', () => {
  let component: DownloadComponentEditorComponent;
  let fixture: ComponentFixture<DownloadComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
