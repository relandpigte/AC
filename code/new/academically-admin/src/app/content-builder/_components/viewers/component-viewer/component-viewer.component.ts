import { Component, OnInit, Input } from '@angular/core';
import { ComponentContent } from '../../../_models/component-content';
import { PageBuilderService } from '../../../_services/page-builder.service';

@Component({
  selector: 'app-component-viewer',
  templateUrl: './component-viewer.component.html',
  styleUrls: ['./component-viewer.component.less']
})
export class ComponentViewerComponent implements OnInit {
  @Input() component: ComponentContent;
  selectedComponent: ComponentContent;
  isPreviewOnly = false;

  constructor(
    private _pageBuilderService: PageBuilderService,
  ) {
    this._pageBuilderService.content$.subscribe(content => {
      this.selectedComponent = content as ComponentContent;
    });
    this._pageBuilderService.previewOnly$.subscribe(response => {
      if (response) {
        this.isPreviewOnly = response;
      }
    });
  }

  ngOnInit(): void {
  }

  onComponentClick(): void {
    this._pageBuilderService.content = this.component;
  }
}
