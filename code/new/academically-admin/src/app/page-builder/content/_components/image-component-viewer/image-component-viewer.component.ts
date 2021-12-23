import { Component, OnInit, Input } from '@angular/core';
import { ImageComponentContent } from '../../_models/image-component-content';

@Component({
  selector: 'app-image-component-viewer',
  templateUrl: './image-component-viewer.component.html',
  styleUrls: ['./image-component-viewer.component.less']
})
export class ImageComponentViewerComponent implements OnInit {
  @Input() component: ImageComponentContent;

  constructor() { }

  ngOnInit(): void {
  }

}
