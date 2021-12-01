import { Component, Input, OnInit } from '@angular/core';
import { SectionContent } from '@app/page-builder/_models/section-content';

@Component({
  selector: 'app-section-preview',
  templateUrl: './section-preview.component.html',
  styleUrls: ['./section-preview.component.less']
})
export class SectionPreviewComponent implements OnInit {
  @Input() content: SectionContent;

  constructor() { }

  ngOnInit(): void {
  }

}
