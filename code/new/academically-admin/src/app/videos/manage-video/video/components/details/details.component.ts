import { Component, Injector, Input } from '@angular/core';
import { VideoAttachmentDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-video-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AppComponentBase{
  @Input() isFirst: boolean;
  @Input() data: VideoAttachmentDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get fileType(): string { return this.data?.document?.fileType; }
  get fileName(): string { return this.data?.document?.originalFileName; }
  get fileSize(): number { return this.data?.document?.size; }

}
