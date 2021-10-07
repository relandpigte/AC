import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PageSection } from '@app/page-builder/_models/page-section';
import { PageContent } from '@app/page-builder/_models/page-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';
import { CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { PageComponent } from '@app/page-builder/_models/page-component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase implements OnInit {
  courseSectionPage = new CourseSectionPageDto();
  pageSections: PageSection[] = [];
  selectedPageSection: PageSection;
  selectedPageContent: PageContent;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    this.pageSections.push(new PageSection());
    console.log(this.pageSections);

    this._pageBuilderService.pageContent$.subscribe(pageContent => {
      this.selectedPageContent = pageContent;
      if (pageContent.name !== 'Section') {
        _.forEach(this.pageSections, pageSection => {
          if (pageSection.pageComponents.findIndex(e => e === this.selectedPageContent) >= 0) {
            this.selectedPageSection = pageSection;
            return false;
          }
        });
      }
    });
  }

  public initializeContentManager(): void {
    if (!this.courseSectionPage || !this.courseSectionPage.id) {
      this.pageSections = [new PageSection()];
    } else {
      const pageSectionObjects: any[] = JSON.parse(this.courseSectionPage.pageContent);
      this.pageSections = _.map(pageSectionObjects, pageSectionObject => {
        const pageSection: PageSection = Object.assign(new PageSection(), pageSectionObject);
        pageSection.pageComponents = _.map(pageSection.pageComponents, pageComponent => {
          return Object.assign(new PageComponent(), pageComponent);
        });
        return pageSection;
      });
    }


    this.selectedPageSection = this.pageSections[0];
    this._pageBuilderService.pageContent = this.pageSections[0];
  }

  public prepareContentsForSaving(courseSectionId: string): CourseSectionPageDto {
    this.courseSectionPage.courseSectionId = courseSectionId;
    this.courseSectionPage.pageContent = JSON.stringify(this.pageSections);
    return this.courseSectionPage;
  }

  ngOnInit(): void {
  }

  onSelectParent(): void {
    this._pageBuilderService.pageContent = this.selectedPageSection;
  }

  onAddPageSectionClick(): void {
    const pageSection = new PageSection();
    this.pageSections.push(pageSection);
    this._pageBuilderService.pageContent = pageSection;
  }

  onDeletePageContent(pageContent: PageContent): void {
    this.message.confirm(undefined, undefined, (result) => {
      if (result) {
        if (pageContent.name === 'Section') {
          const index = this.pageSections.findIndex(e => e === pageContent);
          if (index >= 0) {
            this.pageSections.splice(index, 1);
            this._pageBuilderService.pageContent = undefined;
          }
        } else {
          const index = this.selectedPageSection.pageComponents.findIndex(e => e === pageContent);
          if (index >= 0) {
            this.selectedPageSection.pageComponents.splice(index, 1);
            this._pageBuilderService.pageContent = this.selectedPageSection;
          }
        }
      }
    });
  }
}
