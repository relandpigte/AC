import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ContentDto, ContentsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentContent } from './_models/component-content';
import { Content } from './_models/content';
import { LessonContent } from './_models/lesson-content';
import { PageContent } from './_models/page-content';
import { PageBuilderService } from './_services/page-builder.service';

@Component({
  selector: 'app-content-builder',
  templateUrl: './content-builder.component.html',
  styleUrls: ['./content-builder.component.less']
})
export class ContentBuilderComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() set referenceId(value: string) {
    if (value) {
      this.initializeContentManager(value);
    }
  }
  @Input() isSinglePage = false;
  pageContent = new ContentDto();
  content: Content;
  lessonContent: LessonContent;
  autoSaveSub: Subscription;

  constructor(
    injector: Injector,
    private _contentsService: ContentsServiceProxy,
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
        this._pageBuilderService.remove = undefined;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._pageBuilderService.content = undefined;
    this.autoSaveSub.unsubscribe();
    this.save();
  }

  private initializeContentManager(referenceId: string): void {
    this._pageBuilderService.singlePageOnly = this.isSinglePage;
    this._contentsService.get(referenceId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.pageContent = response;
        if (!this.pageContent || !this.pageContent.referenceId) {
          this.pageContent = new ContentDto();
          this.pageContent.referenceId = referenceId;
          this.setDefaultContents();
        } else {
          const lessonContentObject: LessonContent = JSON.parse(this.pageContent.pageContent);
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
            if (this.isSinglePage) {
              this._pageBuilderService.content = this.lessonContent.pages[0];
            } else {
              this._pageBuilderService.content = this.lessonContent;
            }
          }
        }

        this.initAutoSave();
      });
  }

  private prepareContentsForSaving(): ContentDto {
    this.pageContent.pageContent = JSON.stringify(this.lessonContent);
    return this.pageContent;
  }

  private setDefaultContents(): void {
    if (this.isSinglePage) {
      this.lessonContent = new LessonContent();
      const defaultPage = new PageContent();
      defaultPage.name = 'Components';
      this.lessonContent.pages.push(defaultPage);
      this._pageBuilderService.content = defaultPage;
    } else {
      this.lessonContent = new LessonContent();
      this._pageBuilderService.content = this.lessonContent;
    }
  }

  private initAutoSave(): void {
    if (this.autoSaveSub) {
      this.autoSaveSub.unsubscribe();
    }
    let content = _.cloneDeep(this.pageContent.pageContent);
    this.autoSaveSub = interval(1000)
      .subscribe(() => {
        const newContent = this.prepareContentsForSaving().pageContent;
        if (content !== newContent) {
          content = newContent;
          this.save();
        }
      });
  }

  private save(): void {
    console.log('contents saved!');
    const content = this.prepareContentsForSaving();
    this._contentsService.save(content)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        // do nothing
      });
  }
}
