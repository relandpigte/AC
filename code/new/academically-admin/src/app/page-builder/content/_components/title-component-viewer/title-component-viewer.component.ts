import { Component, OnInit, Input } from '@angular/core';
import { TitleComponentContent } from '../../_models/title-component-content';

@Component({
  selector: 'app-title-component-viewer',
  templateUrl: './title-component-viewer.component.html',
  styleUrls: ['./title-component-viewer.component.less']
})
export class TitleComponentViewerComponent implements OnInit {
  @Input() component: TitleComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
