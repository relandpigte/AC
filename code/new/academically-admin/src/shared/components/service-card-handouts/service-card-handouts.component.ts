import { Component, Injector, Input, OnInit } from '@angular/core';
import { ServicePresentationDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-service-card-handouts',
  templateUrl: './service-card-handouts.component.html',
  styleUrls: ['./service-card-handouts.component.less']
})
export class ServiceCardHandoutsComponent extends AppComponentBase implements OnInit {
  @Input() isFirst: boolean;
  @Input() data: ServicePresentationDto;

  constructor(injector: Injector) {
    super(injector);
  }

  get fileType(): string { return this.data?.document?.originalFileName?.split('.')?.pop(); }
  get fileName(): string { return this.data?.document?.originalFileName; }
  get fileSize(): number { return this.data?.document?.size; }

  ngOnInit(): void {
  }
}
