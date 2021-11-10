import { Component, OnInit, Input } from '@angular/core';
import { Content } from '@app/page-builder/_models/content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';

@Component({
  selector: 'app-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.less']
})
export class ContentPreviewComponent implements OnInit {
  @Input() content: Content;
  selectedContent: Content;

  constructor(
    private _pageBuilderService: PageBuilderService
  ) {
    this._pageBuilderService.content$.subscribe(content => {
      this.selectedContent = content;
    });
  }

  get margin(): string {
    if (!this.marginTop && !this.marginBottom && !this.marginLeft && !this.marginRight) {
      return '0';
    }

    return `${this.content.marginTop}px ${this.content.marginRight}px `
      + `${this.content.marginBottom}px ${this.content.marginLeft}px`;
  }

  get marginTop(): string {
    return `${this.content.marginTop}px`;
  }

  get marginBottom(): string {
    return `${this.content.marginBottom}px`;
  }

  get marginLeft(): string {
    return `${this.content.marginLeft}px`;
  }

  get marginRight(): string {
    return `${this.content.marginRight}px`;
  }

  ngOnInit(): void {
  }

  onContentClick(): void {
    if (this.selectedContent !== this.content) {
      this._pageBuilderService.content = this.content;
    }
  }
}
