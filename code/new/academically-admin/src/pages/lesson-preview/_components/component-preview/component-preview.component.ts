import { Component, Input, OnInit } from '@angular/core';
import { ComponentContent } from '@app/page-builder/_models/component-content';

@Component({
  selector: 'app-component-preview',
  templateUrl: './component-preview.component.html',
  styleUrls: ['./component-preview.component.less']
})
export class ComponentPreviewComponent implements OnInit {
  @Input() content: ComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
