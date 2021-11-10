import { MarginType } from './margin-type';
import { ComponentContent } from './component-content';

export class TextComponentContent extends ComponentContent {
  text: string;

  constructor() {
    super();
    this.name = 'Text';
    this.icon = 'fe fe-type';
    this.marginType = MarginType.Normal;
    this.setMargins();
  }
}
