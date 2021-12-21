import { ComponentContent } from './component-content';
import { TextComponentContent } from './text-component-content';

export class BodyTextComponentContet extends TextComponentContent {
  constructor() {
    super();
    this.type = 'body-text';
    this.name = 'Body Text';
    this.icon = 'fe fe-type';
    this.description = 'Standard size text that is suitable for use as body text';
  }
}
