import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComponentContent } from '../../_models/component-content';
import { BodyTextComponentContet } from '../../_models/body-text-component-content';
import { PageContent } from '../../_models/page-content';
import { PageBuilderService } from '../../_services/page-builder.service';
import { ImageComponentContent } from '../../_models/image-component-content';
import { BannerImageComponentContent } from '../../_models/banner-image-component-content';

@Component({
  selector: 'app-add-component',
  templateUrl: './add-component.component.html',
  styleUrls: ['./add-component.component.less']
})
export class AddComponentComponent implements OnInit {
  @Input() page: PageContent;
  @Input() appendToComponent: ComponentContent;
  components: ComponentContent[] = [];

  constructor(
    private _modal: BsModalRef,
    private _pageBuilderService: PageBuilderService,
  ) {
    this.components.push(new BannerImageComponentContent());
    this.components.push(new BodyTextComponentContet());
    this.components.push(new ImageComponentContent());
  }

  ngOnInit(): void {
  }

  onComponentSelect(component: ComponentContent): void {
    if (this.appendToComponent) {
      const index = this.page.components.findIndex(e => e === this.appendToComponent);
      if (index >= 0) {
        this.page.components.splice(index + 1, 0, component);
      }
    } else {
      this.page.components.push(component);
    }
    this._pageBuilderService.content = component;
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
