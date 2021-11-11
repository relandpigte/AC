import { Content } from './content';
import { SectionContent } from './section-content';

export class PageContent extends Content {
  sections: SectionContent[];

  constructor() {
    super();
    this.name = 'Page';
    this.backgroundColor = 'transparent';
    this.sections = [];
  }
}
