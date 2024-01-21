import { Component, Injector, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { ArticleService } from '@app/articles/_services/article.service';
import { CreateOfferComponent } from '@app/dashboard/events/portal/broadcast/student/portal/_components/offers/_components/create-offer/create-offer.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.less']
})
export class OffersComponent extends AppComponentBase implements OnInit {
  id: string;
  offers: any;

  constructor(
    injector: Injector,
    private _articleService: ArticleService,
    private _bsModalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.offers = true;
    this._articleService.articleCreated$.subscribe(article => {
      if (!article) {
        return;
      }
      this.id = article.id;
    });
  }

  onAddOffer(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateOfferComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { referenceId: this.id };
    this._bsModalService.show(CreateOfferComponent, modalSettings);
  }
}
