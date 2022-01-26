import { TextComponentContent } from './text-component-content';
import { MarginType } from './margin-type';

export class SubtitleComponentContent extends TextComponentContent {
  constructor() {
    super();
    this.type = 'subtitle';
    this.name = 'Subtitle';
    this.icon = 'fe fe-type';
    this.description = 'Medium size text that is suitable for user as a subtitle';
    this.marginType = MarginType.Narrow;
    this.setMargins();
  }
}
