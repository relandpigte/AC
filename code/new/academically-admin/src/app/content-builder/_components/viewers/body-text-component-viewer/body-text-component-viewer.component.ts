import { Component, OnInit, Input } from '@angular/core';
import { BodyTextComponentContent } from '../../../_models/body-text-component-content';

@Component({
  selector: 'app-body-text-component-viewer',
  templateUrl: './body-text-component-viewer.component.html',
  styleUrls: ['./body-text-component-viewer.component.less']
})
export class BodyTextComponentViewerComponent implements OnInit {
  @Input() component: BodyTextComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
