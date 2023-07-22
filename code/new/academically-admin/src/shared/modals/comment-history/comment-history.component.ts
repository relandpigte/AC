import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CommentDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-comment-history',
  templateUrl: './comment-history.component.html',
  styleUrls: ['./comment-history.component.scss']
})
export class CommentHistoryComponent extends AppComponentBase implements OnInit{
  @Input() data: CommentDto;

  histories: CommentDto[] = [];

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.constructCommentHistory();
  }

  onCloseCommentHistoryModal(): void {
    this._modal.hide();
  }

  private constructCommentHistory(): void {
    const { commentEditHistories : arrHistory, creationTime } = this.data;
    this.histories.push(this.data);

    if (arrHistory) {
      arrHistory?.map((h, index) => {
        const history = new CommentDto(this.data);

        history.lastModificationTime = arrHistory[index + 1]?.changeTime ??  creationTime;
        history.body = h.body;
        this.histories.push(history);
      });
    }
  }
}
