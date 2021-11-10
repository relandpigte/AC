import { Content } from './content';
import { ComponentContent } from './component-content';

export class SectionContent extends Content {
  components: ComponentContent[];

  constructor() {
    super();
    this.name = 'Section';
    this.components = [];
  }
}
