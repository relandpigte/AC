import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';

@Component({
  selector: 'app-session-badge',
  templateUrl: './session-badge.component.html',
  styleUrls: ['./session-badge.component.less']
})
export class SessionBadgeComponent extends AppComponentBase implements OnInit {
  readonly showMoreLimit: number = 255;
  showMore = false;

  shimmerType = ShimmerType;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  get description(): string { return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus tempor metus, in convallis velit dictum vel. Fusce eget auctor nisi. Aliquam venenatis sem id mollis eleifend. Cras sit amet lorem pharetra, vulputate enim vitae, egestas erat. Nam lacinia lectus sit amet porttitor pharetra. Nullam lacinia, enim at iaculis pharetra, purus nulla rhoncus velit, at iaculis neque diam sit amet tellus. In hac habitasse platea dictumst. Fusce sagittis magna sed tellus commodo imperdiet. Aliquam porttitor felis a mauris suscipit condimentum. Aliquam quis faucibus purus, vitae blandit velit. Quisque urna lacus, sollicitudin ac est at, suscipit semper ante.`; }
  get profilePictureUrl(): string { return this.appSession.user.profilePictureUrl; }
  get profileFullName(): string { return `${this.appSession.user.name} ${this.appSession.user.surname}`; }

  ngOnInit(): void {
  }

}
