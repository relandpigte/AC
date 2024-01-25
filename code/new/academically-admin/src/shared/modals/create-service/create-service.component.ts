import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { EventCategory, ServicesType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less']
})
export class CreateServiceComponent extends AppComponentBase {
  @Input() model: any;
  @Input() servicesType: ServicesType;
  @Output() onCreateService = new EventEmitter<any>();

  isLoading = false;
  constructor(injector: Injector, private _modal: BsModalRef) {
    super(injector);
  }

  get serviceTypeName(): string {
    switch (this.servicesType) {
      case ServicesType.Coaching:
        return 'session';
      case ServicesType.Event:
        return this.model?.category === EventCategory.Broadcast ? 'broadcast' : 'workshop';
      default:
        return ServicesType[this.servicesType]?.toLowerCase();
    }
  }
  get isEvent(): boolean { return this.servicesType === ServicesType.Event; }

  onFormSubmit(): void {
    this.onCreateService.emit(this.model);
    this._modal.hide();
  }

  onCancelClick(): void {
    this._modal.hide();
  }
}
