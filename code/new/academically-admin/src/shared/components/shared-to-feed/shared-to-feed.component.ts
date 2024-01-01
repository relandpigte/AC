import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '../../app-component-base';
import { WrapperService } from '@shared/services/wrapper.service';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-shared-to-feed',
  templateUrl: './shared-to-feed.component.html',
  styleUrls: ['./shared-to-feed.component.less']
})
export class SharedToFeedComponent extends AppComponentBase {
  @Input() postId: string;

  timer: any;

  constructor(
    injector: Injector,
    private _wrapperService: WrapperService
  ) {
    super(injector);
  }

  goToPost(e: any): void {
    e.preventDefault();
    if (this.postId) {
      const url = `${AppConsts.appBaseUrl}/app/community/post/${this.postId}`;
      window.open(url, '_blank');
    }
  }
}
