import { ComponentContent } from './component-content';

export abstract class TextComponentContent extends ComponentContent {
  text: string;

  constructor() {
    super();
    this.text = '';
  }
}
