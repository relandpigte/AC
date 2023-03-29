import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PostDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-preview-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class PreviewServicesComponent extends AppComponentBase implements OnInit {
  @Input() data: PostDto;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

}
