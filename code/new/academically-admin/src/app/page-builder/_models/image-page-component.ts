import { PageComponent } from './page-component';
import { MarginType } from './margin-type';

export class ImagePageComponent extends PageComponent {
  base64image: string;
  imageName: string;
  imageSize: number;

  constructor(marginType?: MarginType) {
    super(marginType);
    this.name = 'Image';
    this.icon = 'fe fe-image';
  }
}
