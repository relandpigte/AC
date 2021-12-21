import { ComponentContent } from './component-content';
import { ImageComponentContent } from './image-component-content';
import { MarginType } from './margin-type';

export class BannerImageComponentContent extends ImageComponentContent {
  base64image: string;
  imageName: string;
  imageSize: number;

  constructor() {
    super();
    this.type = 'banner-image';
    this.name = 'Banner Image';
    this.disableMargins = true;
    this.marginType = MarginType.None;
    this.setMargins();
  }
}
