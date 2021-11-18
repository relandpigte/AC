import { Component, Input, OnInit } from '@angular/core';
import { TextComponentContent } from '@app/page-builder/_models/text-component-content';

@Component({
  selector: 'app-text-component-preview',
  templateUrl: './text-component-preview.component.html',
  styleUrls: ['./text-component-preview.component.less']
})
export class TextComponentPreviewComponent implements OnInit {
  @Input() content: TextComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
