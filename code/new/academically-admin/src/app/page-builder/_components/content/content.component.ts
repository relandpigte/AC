import { Component, Injector, OnInit } from '@angular/core';
import { ComponentContent } from '@app/page-builder/_models/component-content';
import { Content } from '@app/page-builder/_models/content';
import { PageContent } from '@app/page-builder/_models/page-content';
import { SectionContent } from '@app/page-builder/_models/section-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase implements OnInit {
  courseSectionPage = new CourseSectionPageDto();
  contents: PageContent[] = [];
  currentContent: Content;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    this._pageBuilderService.content$.subscribe(content => {
      this.currentContent = content;
    });
  }

  ngOnInit(): void {
  }

  public initializeContentManager(): void {
    if (!this.courseSectionPage || !this.courseSectionPage.id) {
      this.setDefaultContents();
    } else {
      const pageContentObjects: any[] = JSON.parse(this.courseSectionPage.pageContent);
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
      if (!this.contents || !this.contents.length) {
        this.setDefaultContents();
      }
    }
  }

  public prepareContentsForSaving(courseSectionId: string): CourseSectionPageDto {
    this.courseSectionPage.courseSectionId = courseSectionId;
    this.courseSectionPage.pageContent = JSON.stringify(this.contents);
    return this.courseSectionPage;
  }

  public preparepageContentForSaving(): string {
    return JSON.stringify(this.contents);
  }

  onAddClick(): void {
    const page = new PageContent();
    page.sections.push(new SectionContent());
    this.contents.push(page);
    this._pageBuilderService.content = page;
  }

  onDeleteContent(content: Content): void {
    this.message.confirm(undefined, undefined, (result) => {
      if (result) {
        _.forEach(this.contents, page => {
          if (!this.deleteIfFound(this.contents, content)) {
            _.forEach(page.sections, section => {
              if (!this.deleteIfFound(page.sections, content)) {
                _.forEach(section.components, component => {
                  if (this.deleteIfFound(section.components, content)) {
                    return false;
                  }
                });
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        });
        this._pageBuilderService.content = undefined;
      }
    });
  }

  onSelectParent(content: Content): void {
    let parent: Content;
    _.forEach(this.contents, page => {
      if (parent) {
        return false;
      }
      _.forEach(page.sections, section => {
        if (section === content) {
          parent = page;
        }
        if (parent) {
          return false;
        }
        _.forEach(section.components, component => {
          if (component === content) {
            parent = section;
          }
          if (parent) {
            return false;
          }
        });
      });
    });
    if (parent) {
      this._pageBuilderService.content = parent;
    }
  }

  private deleteIfFound(items: Content[], item: Content): boolean {
    const index = items.findIndex(e => e === item);
    if (index >= 0) {
      items.splice(index, 1);
      return true;
    }
    return false;
  }

  private setDefaultContents(): void {
    const page = new PageContent();
    const section = new SectionContent();
    page.sections.push(section);
    this.contents.push(page);
  }
}
