import { Component, Input, OnInit } from '@angular/core';
import { Content } from '@app/page-builder/_models/content';

@Component({
  selector: 'app-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.less']
})
export class ContentPreviewComponent implements OnInit {
  @Input() content: Content;

  constructor() { }

  ngOnInit(): void {
  }

}
