import { PageComponent } from './page-component';

export class ImagePageComponent extends PageComponent {
  base64image: string;
  imageName: string;
  imageSize: number;

  constructor() {
    super();
    this.name = 'Image';
    this.icon = 'fe fe-image';
  }
}
