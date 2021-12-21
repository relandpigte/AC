import { Content } from './content';
import { ComponentContent } from './component-content';

export class PageContent extends Content {
  components: ComponentContent[];

  constructor(name?: string) {
    super();
    this.type = 'page';
    this.name = name;
    this.components = [];
  }
}
