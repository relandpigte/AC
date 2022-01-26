import { TextComponentContent } from './text-component-content';

export class TitleComponentContent extends TextComponentContent {
  constructor() {
    super();
    this.type = 'title';
    this.name = 'Title';
    this.icon = 'fe fe-type';
    this.description = 'Large text that is suitable for user as a title';
  }
}
