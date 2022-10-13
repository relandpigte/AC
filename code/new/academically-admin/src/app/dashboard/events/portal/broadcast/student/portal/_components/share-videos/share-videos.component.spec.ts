import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareVideosComponent } from './share-videos.component';

describe('ShareVideosComponent', () => {
  let component: ShareVideosComponent;
  let fixture: ComponentFixture<ShareVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
