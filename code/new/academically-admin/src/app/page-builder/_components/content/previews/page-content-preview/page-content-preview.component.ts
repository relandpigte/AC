import { Component, OnInit, Input, Injector } from '@angular/core';
import { PageContent } from '@app/page-builder/_models/page-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-page-content-preview',
  templateUrl: './page-content-preview.component.html',
  styleUrls: ['./page-content-preview.component.less']
})
export class PageContentPreviewComponent extends AppComponentBase implements OnInit {
  @Input() pageContent: PageContent = new PageContent();
  selectedPageContent: PageContent;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
    this._pageBuilderService.pageContent$.subscribe(pageContent => {
      this.selectedPageContent = pageContent;
    });
  }

  get margin(): string {
    if (!this.marginTop && !this.marginBottom && !this.marginLeft && !this.marginRight) {
      return '0';
    }

    return `${this.pageContent.marginTop}px ${this.pageContent.marginRight}px `
      + `${this.pageContent.marginBottom}px ${this.pageContent.marginLeft}px`;
  }

  get marginTop(): string {
    return `${this.pageContent.marginTop}px`;
  }

  get marginBottom(): string {
    return `${this.pageContent.marginBottom}px`;
  }

  get marginLeft(): string {
    return `${this.pageContent.marginLeft}px`;
  }

  get marginRight(): string {
    return `${this.pageContent.marginRight}px`;
  }

  ngOnInit(): void {
  }

  onPageContentClick(): void {
    if (this.selectedPageContent !== this.pageContent) {
      this._pageBuilderService.pageContent = this.pageContent;
    }
  }
}
