import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSeriesComponent } from './article-series.component';

describe('ArticleSeriesComponent', () => {
  let component: ArticleSeriesComponent;
  let fixture: ComponentFixture<ArticleSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
