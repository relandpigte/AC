import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComponentContent } from '../../_models/component-content';
import { BodyTextComponentContent } from '../../_models/body-text-component-content';
import { PageContent } from '../../_models/page-content';
import { PageBuilderService } from '../../_services/page-builder.service';
import { ImageComponentContent } from '../../_models/image-component-content';
import { BannerImageComponentContent } from '../../_models/banner-image-component-content';
import { TitleComponentContent } from '../../_models/title-component-content';
import { SubtitleComponentContent } from '../../_models/subtitle-component-content';
import { VideoComponentContent } from '@app/content-builder/_models/video-component-content';
import { OfficeComponentContent } from '@app/content-builder/_models/office-component-content';
import { PdfComponentContent } from '@app/content-builder/_models/pdf-component-content';
import { AudioComponentContent } from '@app/content-builder/_models/audio-component-content';
import { DownloadComponentContent } from '@app/content-builder/_models/download-component-content';
import { LinkComponentContent } from '@app/content-builder/_models/link-component-content';

@Component({
  selector: 'app-add-component',
  templateUrl: './add-component.component.html',
  styleUrls: ['./add-component.component.less']
})
export class AddComponentComponent implements OnInit {
  @Input() page: PageContent;
  @Input() appendToComponent: ComponentContent;
  allComponents: ComponentContent[] = [];
  components: ComponentContent[] = [];
  searchFilter: string;

  constructor(
    private _modal: BsModalRef,
    private _pageBuilderService: PageBuilderService,
  ) {
    this.allComponents.push(new TitleComponentContent());
    this.allComponents.push(new SubtitleComponentContent());
    this.allComponents.push(new BodyTextComponentContent());
    this.allComponents.push(new BannerImageComponentContent());
    this.allComponents.push(new ImageComponentContent());
    this.allComponents.push(new VideoComponentContent());
    this.allComponents.push(new OfficeComponentContent());
    this.allComponents.push(new PdfComponentContent());
    this.allComponents.push(new AudioComponentContent());
    this.allComponents.push(new DownloadComponentContent());
    this.allComponents.push(new LinkComponentContent());
    this.components = [...this.allComponents];
  }

  ngOnInit(): void {
  }

  onSearchSubmit(): void {
    this.components = this.allComponents.filter(component => {
      const searchFilter = this.searchFilter.toLowerCase();
      return component.type.toLowerCase().includes(searchFilter)
        || component.description.toLowerCase().includes(searchFilter);
    });
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
