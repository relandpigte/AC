import { Component, EventEmitter, Inject, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-accept-tutor-offer',
  templateUrl: './accept-tutor-offer.component.html',
  styleUrls: ['./accept-tutor-offer.component.less']
})
export class AcceptTutorOfferComponent extends AppComponentBase implements OnInit {
  @Input() offer: GetTutorOfferDto;
  @Output() modalSave = new EventEmitter<any>();
  isLoading = false;
  constructor(injector: Injector, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {}

  onFormSubmit(): void {
    this.saveAcceptTutorOffer();
  }

  onCloseClick(): void {
    this.close();
  }

  private saveAcceptTutorOffer(): void {
    this.offer.isAccepted = true;
    this.modalSave.emit(this.offer);
    this.close();
  }

  private close(): void {
    this._modalRef.hide();
  }
}
