import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ResearchMethodRequestDto, ResearchMethodsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-request-new-research-method',
  templateUrl: './request-new-research-method.component.html',
  styleUrls: ['./request-new-research-method.component.less'],
})
export class RequestNewResearchMethodComponent extends AppComponentBase implements OnInit {
  @Input() researchMethodId: string;
  model: ResearchMethodRequestDto = new ResearchMethodRequestDto();
  isLoading = false;

  constructor(injector: Injector, private _researchMethodsService: ResearchMethodsServiceProxy, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.model.parentId = this.researchMethodId;
  }

  onCloseClick(): void {
    this.close();
  }

  onFormSubmit(): void {
    this.saveResearchMethodRequest();
  }

  private close(): void {
    this._modalRef.hide();
  }

  private saveResearchMethodRequest(): void {
    this._researchMethodsService
      .requestResearchMethod(this.model)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success('NewResearchMethodRequestSent');
        this.close();
      });
  }
}
