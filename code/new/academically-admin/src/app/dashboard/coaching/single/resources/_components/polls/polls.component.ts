import { Component, OnInit, Injector } from '@angular/core';
import { CreateEditPollComponent } from '../create-edit-poll/create-edit-poll.component';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { CoachingDto, CoachingPollDto, CoachingPollsServiceProxy, ServicePollDto, ServicePollsServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { ServiceCreatePollComponent } from '@shared/components/service-create-poll/service-create-poll.component';

class PagedServicePollResultRequestDto extends PagedAndSortedRequestDto {
  referenceIdFilter: string;
  serviceTypeFilter: ServicesType;
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends PagedListingComponentBase<ServicePollDto> implements OnInit {
  coaching = new CoachingDto();
  coachingPolls: ServicePollDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _coachingService: CoachingService,
    private _servicePollsService: ServicePollsServiceProxy,
    private _modalDialogService: ModalDialogService
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
    const modalSettings = this.defaultModalSettings as ModalOptions<ServiceCreatePollComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      referenceId: this.coaching.id,
      serviceType: ServicesType.Coaching
    };
    const modal = this._modalService.show(ServiceCreatePollComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onDeleteClick(coachingPoll: ServicePollDto): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteCoachingPollConfirmationMessage'),
      confirmCb: (): void => {
        this.isLoading = true;
        this._servicePollsService.delete(coachingPoll.id)
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
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  protected list(
    request: PagedServicePollResultRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.coaching.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.referenceIdFilter = this.coaching.id;

      this._servicePollsService
        .getAll(
          request.referenceIdFilter,
          ServicesType.Coaching,
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
