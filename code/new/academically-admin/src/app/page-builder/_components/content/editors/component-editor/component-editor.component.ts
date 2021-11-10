import { Component, Input, OnInit } from '@angular/core';
import { ComponentContent } from '@app/page-builder/_models/component-content';

@Component({
  selector: 'app-component-editor',
  templateUrl: './component-editor.component.html',
  styleUrls: ['./component-editor.component.less']
})
export class ComponentEditorComponent implements OnInit {
  @Input() content: ComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
