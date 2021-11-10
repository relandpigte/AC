import { MarginType } from './margin-type';
import { ImageComponentContent } from './image-component-content';

export class HeaderComponentContent extends ImageComponentContent {

  constructor() {
    super();
    this.name = 'Header';
    this.disableMargins = true;
    this.marginType = MarginType.None;
    this.setMargins();
  }
}
