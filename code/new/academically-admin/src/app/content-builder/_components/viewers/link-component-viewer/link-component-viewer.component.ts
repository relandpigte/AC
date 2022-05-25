import { Component, OnInit, Input } from '@angular/core';
import { LinkComponentContent } from '@app/content-builder/_models/link-component-content';

@Component({
  selector: 'app-link-component-viewer',
  templateUrl: './link-component-viewer.component.html',
  styleUrls: ['./link-component-viewer.component.less']
})
export class LinkComponentViewerComponent implements OnInit {
  @Input() component: LinkComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
