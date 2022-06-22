import { Component, OnInit, Injector } from '@angular/core';
import { CreateEditPollComponent } from '../create-edit-poll/create-edit-poll.component';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { CoachingDto, CoachingPollDto, CoachingPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';

class PagedCoachingPollRequestDto extends PagedAndSortedRequestDto {
  coachingIdFilter: string;
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends PagedListingComponentBase<CoachingPollDto> implements OnInit {
  coaching = new CoachingDto();
  coachingPolls: CoachingPollDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _coachingService: CoachingService,
    private _coachingPollsService: CoachingPollsServiceProxy,
  ) {
    super(injector);
    this._coachingService.coachingCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.coaching = response;
          this.refresh();
        }
      });
  }

  ngOnInit(): void {
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      coachingId: this.coaching.id,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onDeleteClick(coachingPoll: CoachingPollDto): void {
    this.message.confirm(this.l('DeleteCoachingPollConfirmationMessage'), undefined, (result => {
      if (result) {
        this.isLoading = true;
        this._coachingPollsService.delete(coachingPoll.id)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.pageNumber = 1;
            this.refresh();
          });
      }
    }));
  }

  protected list(
    request: PagedCoachingPollRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.coaching.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.coachingIdFilter = this.coaching.id;

      this._coachingPollsService
        .getAll(
          request.coachingIdFilter,
          request.sort,
          request.skipCount,
          request.maxResultCount
        )
        .pipe(
          finalize(() => {
            finishedCallback();
            this.isLoading = false;
          })
        )
        .subscribe(result => {
          this.coachingPolls = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
