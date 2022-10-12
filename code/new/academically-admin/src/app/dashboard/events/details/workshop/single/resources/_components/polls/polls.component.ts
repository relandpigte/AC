import { Component, OnInit, Injector } from '@angular/core';
import { CreateEditPollComponent } from '../create-edit-poll/create-edit-poll.component';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { WorkshopService } from '@app/dashboard/events/_services/workshop.service';
import { WorkshopDto, WorkshopPollDto, WorkshopPollsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';

class PagedWorkshopPollRequestDto extends PagedAndSortedRequestDto {
  workshopIdFilter: string;
}

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.less']
})
export class PollsComponent extends PagedListingComponentBase<WorkshopPollDto> implements OnInit {
  workshop = new WorkshopDto();
  workshopPolls: WorkshopPollDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _workshopService: WorkshopService,
    private _workshopPollsService: WorkshopPollsServiceProxy,
  ) {
    super(injector);
    this._workshopService.workshopCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.workshop = response;
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
      workshopId: this.workshop.id,
    };
    const modal = this._modalService.show(CreateEditPollComponent, modalSettings).content;
    modal.modelSaved
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  onDeleteClick(workshopPoll: WorkshopPollDto): void {
    this.message.confirm(this.l('DeleteWorkshopPollConfirmationMessage'), undefined, (result => {
      if (result) {
        this.isLoading = true;
        this._workshopPollsService.delete(workshopPoll.id)
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
    request: PagedWorkshopPollRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    if (this.workshop.id) {
      this.isLoading = true;
      request.sort = 'name';
      request.workshopIdFilter = this.workshop.id;

      this._workshopPollsService
        .getAll(
          request.workshopIdFilter,
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
          this.workshopPolls = result.items;
          this.showPaging(result, pageNumber);
        });
    }
  }
}
