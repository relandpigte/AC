import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPhotoChangerComponent } from './cover-photo-changer.component';

describe('CoverPhotoChangerComponent', () => {
  let component: CoverPhotoChangerComponent;
  let fixture: ComponentFixture<CoverPhotoChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverPhotoChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPhotoChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
