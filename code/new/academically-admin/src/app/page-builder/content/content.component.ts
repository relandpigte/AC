import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PageBuilderService } from './_services/page-builder.service';
import { Content } from './_models/content';
import { LessonContent } from './_models/lesson-content';
import * as _ from 'lodash';
import { CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import { PageContent } from './_models/page-content';
import { ComponentContent } from './_models/component-content';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase implements OnInit {
  courseSectionPage = new CourseSectionPageDto();
  content: Content;
  lessonContent: LessonContent;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    this._pageBuilderService.content$.subscribe(content => {
      if (content) {
        this.content = content;
      }
    });
    this._pageBuilderService.navigateUp$.subscribe(content => {
      if (content) {
        if (content.type === 'page') {
          this._pageBuilderService.content = this.lessonContent;
        } else {
          _.each(this.lessonContent.pages, page => {
            _.each(page.components, component => {
              if (component === content) {
                this._pageBuilderService.content = page;
                return false;
              }
            });
          });
        }
      }
    });
    this._pageBuilderService.remove$.subscribe(content => {
      if (content) {
        this.message.confirm(null, null, (response) => {
          if (response) {
            if (content.type === 'page') {
              const index = this.lessonContent.pages.findIndex(e => e === content);
              if (index >= 0) {
                this.lessonContent.pages.splice(index, 1);
                this._pageBuilderService.content = this.lessonContent;
              }
            } else {
              _.each(this.lessonContent.pages, page => {
                _.each(page.components, component => {
                  if (component === content) {
                    const index = page.components.findIndex(e => e === content);
                    if (index >= 0) {
                      page.components.splice(index, 1);
                      this._pageBuilderService.content = page;
                      return false;
                    }
                  }
                });
              });
            }
          }
        });
      }
    });
  }

  ngOnInit(): void {
  }

  public initializeContentManager(): void {
    if (!this.courseSectionPage || !this.courseSectionPage.id) {
      this.setDefaultContents();
    } else {
      const lessonContentObject: LessonContent = JSON.parse(this.courseSectionPage.pageContent);
      this.lessonContent = Object.assign(new LessonContent(), lessonContentObject);
      this.lessonContent.pages = _.map(this.lessonContent.pages, pageContentObject => {
        const pageContent = Object.assign(new PageContent(), pageContentObject);
        pageContent.components = _.map(pageContent.components, componentContentObject => {
          return Object.assign(new ComponentContent(), componentContentObject);
        });
        return pageContent;
      });

      if (!this.lessonContent || !this.lessonContent.pages || !this.lessonContent.pages.length) {
        this.setDefaultContents();
      } else {
        this._pageBuilderService.content = this.lessonContent;
      }
    }
  }

  public prepareContentsForSaving(courseSectionId: string): CourseSectionPageDto {
    this.courseSectionPage.courseSectionId = courseSectionId;
    this.courseSectionPage.pageContent = JSON.stringify(this.lessonContent);
    return this.courseSectionPage;
  }

  private setDefaultContents(): void {
    this.lessonContent = new LessonContent();
    this._pageBuilderService.content = this.lessonContent;
  }
}
