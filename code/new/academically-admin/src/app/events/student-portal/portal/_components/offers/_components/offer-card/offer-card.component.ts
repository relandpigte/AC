import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.less']
})
export class OfferCardComponent extends AppComponentBase implements OnInit {
  @Input() offer: any;
  @Input() selection: boolean = false;

  get ThumbnailSrc(): string { return this.getServiceImageUrl(null); }
  get Name(): string { return this.offer?.name ?? 'Test Offer'; }
  get OfferSize(): number { return this.offer?.size ?? 723.86; }
  get OfferSizeUnit(): string { return this.offer?.sizeUnit ?? 'Kb'; }
  get OfferType(): string { return this.offer?.type ?? 'PNG'; }
  get SharedAt(): string { return (this.offer?.shared ?? moment()).format('HH:mm'); }

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
