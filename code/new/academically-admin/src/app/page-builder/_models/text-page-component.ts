import { PageComponent } from './page-component';

export class TextPageComponent extends PageComponent {
  text: string;

  constructor(
    text?: string,
  ) {
    super();
    this.name = 'Text';
    this.icon = 'fe fe-type';
    this.text = text || '';
  }
}
