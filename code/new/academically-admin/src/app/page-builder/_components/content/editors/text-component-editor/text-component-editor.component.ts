import { Component, Input, OnInit } from '@angular/core';
import { TextComponentContent } from '@app/page-builder/_models/text-component-content';

@Component({
  selector: 'app-text-component-editor',
  templateUrl: './text-component-editor.component.html',
  styleUrls: ['./text-component-editor.component.less']
})
export class TextComponentEditorComponent implements OnInit {
  @Input() content: TextComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
