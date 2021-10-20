import { ImagePageComponent } from './image-page-component';
import { MarginType } from './margin-type';

export class HeaderPageComponent extends ImagePageComponent {
  constructor() {
    super(MarginType.None);
    this.name = 'Header';
    this.disableMargins = true;
  }
}
