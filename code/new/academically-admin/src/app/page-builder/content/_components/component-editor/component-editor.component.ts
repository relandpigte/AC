import { Component, OnInit, Input } from '@angular/core';
import { ComponentContent } from '../../_models/component-content';
import { MarginType } from '../../_models/margin-type';
import { PageBuilderService } from '../../_services/page-builder.service';

@Component({
  selector: 'app-component-editor',
  templateUrl: './component-editor.component.html',
  styleUrls: ['./component-editor.component.less']
})
export class ComponentEditorComponent implements OnInit {
  @Input() component: ComponentContent;
  MarginType = MarginType;

  constructor(
    private _pageBuilderService: PageBuilderService,
  ) { }

  ngOnInit(): void {
  }

  onMoveUpClick(): void {
    this._pageBuilderService.nagivateUp = this.component;
  }

  onMarginTypeChange(): void {
    this.component.setMargins();
  }

  onRemoveClick(): void {
    this._pageBuilderService.remove = this.component;
  }
}
