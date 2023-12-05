import { Component, Injector, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentContent } from '@app/content-builder/_models/component-content';
import { LessonContent } from '@app/content-builder/_models/lesson-content';
import { PageContent } from '@app/content-builder/_models/page-content';
import { PageBuilderService } from '@app/content-builder/_services/page-builder.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lesson-preview',
  templateUrl: './lesson-preview.component.html',
  styleUrls: ['./lesson-preview.component.less']
})
export class LessonPreviewComponent extends AppComponentBase implements OnInit {
  @Input() hasReviewed: boolean;
  @Output() nextSection = new EventEmitter();
  @Output() writeReview = new EventEmitter();
  contents: PageContent[] = [];
  currentPage = 0;
  isCompleted = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _contentsService: ContentsServiceProxy,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.getPages(paramMap.get('id'));
      }
    });
  }

  @Input() set id(value: string) {
    this.getPages(value);
  }

  @Input() set completed(value: boolean) {
    this.isCompleted = value;
    if (this.isCompleted) {
      this.contents = [];
    }
  }

  ngOnInit(): void {
    this._pageBuilderService.previewOnly = true;
  }

  onPreviousClick(): void {
    this.currentPage--;
  }

  onNextClick(): void {
    if (this.currentPage === this.contents.length - 1 || this.contents.length === 0) {
      this.nextSection.emit();
    } else {
      this.currentPage++;
    }
  }

  onReviewClick(): void {
    this.writeReview.emit();
  }

  private getPages(courseSectionId: string): void {
    this.contents = [];
    this._contentsService.get(courseSectionId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.pageContent) {
          const lessonContentObject: LessonContent = JSON.parse(response.pageContent);
          const lessonContent = Object.assign(new LessonContent(), lessonContentObject);
          lessonContent.pages = _.map(lessonContent.pages, pageContentObject => {
            const pageContent = Object.assign(new PageContent(), pageContentObject);
            pageContent.components = _.map(pageContent.components, componentContentObject => {
              return Object.assign(new ComponentContent(), componentContentObject);
            });
            return pageContent;
          });
          this.contents = lessonContent.pages;
        }
      });
  }
}
