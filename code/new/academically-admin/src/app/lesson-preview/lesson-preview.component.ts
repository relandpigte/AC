import { Component, Injector, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentContent } from '@app/page-builder/_models/component-content';
import { Content } from '@app/page-builder/_models/content';
import { PageContent } from '@app/page-builder/_models/page-content';
import { SectionContent } from '@app/page-builder/_models/section-content';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionPagesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lesson-preview',
  templateUrl: './lesson-preview.component.html',
  styleUrls: ['./lesson-preview.component.less']
})
export class LessonPreviewComponent extends AppComponentBase implements OnInit {
  @Output() nextSection = new EventEmitter();
  contents: Content[] = [];
  currentPage = 0;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _courseSectionPagesService: CourseSectionPagesServiceProxy,
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

  ngOnInit(): void {
    document.body.style.backgroundColor = '#FFFFFF';
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

  private getPages(courseSectionId: string): void {
    this.contents = [];
    this._courseSectionPagesService.get(courseSectionId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.pageContent) {
          const pageContentObjects: any[] = JSON.parse(response.pageContent);
          this.contents = _.map(pageContentObjects, pageContentObject => {
            const pageContent: PageContent = Object.assign(new PageContent(), pageContentObject);
            pageContent.sections = _.map(pageContent.sections, sectionContentObject => {
              const sectionContent = Object.assign(new SectionContent(), sectionContentObject);
              sectionContent.components = _.map(sectionContent.components, componentContent => {
                return Object.assign(new ComponentContent(), componentContent);
              });
              return sectionContent;
            });
            return pageContent;
          });
        }
      });
  }
}
