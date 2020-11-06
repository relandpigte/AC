import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SupportServiceRequestDto, SupportServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-request-new-support-service',
  templateUrl: './request-new-support-service.component.html',
  styleUrls: ['./request-new-support-service.component.less'],
})
export class RequestNewSupportServiceComponent extends AppComponentBase implements OnInit {
  @Input() supportServiceId: string;
  model: SupportServiceRequestDto = new SupportServiceRequestDto();
  isLoading = false;

  constructor(injector: Injector, private _supportServicesService: SupportServicesServiceProxy, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.model.parentId = this.supportServiceId;
  }

  onCloseClick(): void {
    this.close();
  }

  onFormSubmit(): void {
    this.saveSupportServiceRequest();
  }

  private close(): void {
    this._modalRef.hide();
  }

  private saveSupportServiceRequest(): void {
    this.isLoading = true;
    this._supportServicesService
      .requestSupportService(this.model)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('NewSupportServiceRequestSent'));
        this.close();
      });
  }
}
