import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateEditBookingComponent } from '@app/calendar/_components/create-edit-booking/create-edit-booking.component';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventsServiceProxy, ProjectOfferDto, ProjectOffersServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-tutor-proposal.component.html',
  styleUrls: ['./view-tutor-proposal.component.less']
})
export class ViewTutorProposalComponent extends AppComponentBase implements OnInit {
  @Input() projectOffer: ProjectOfferDto = new ProjectOfferDto();
  userTitle: string;
  modalTitle: string;
  isLoading = false;
  isHourlyTutorialOffered = false;
  showPayButton = false;
  sessions: CalendarEventDto[] = [];
  forEdit: CalendarEventDto;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _router: Router,
    private _modalService: BsModalService,
    private _projectOffersService: ProjectOffersServiceProxy,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.modalTitle = this.projectOffer.creatorUser.name + '\'s Offer';

    this.isLoading = true;
    this._projectOffersService.get(this.projectOffer.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.projectOffer = response;
        this.isHourlyTutorialOffered = this.projectOffer.isDiscountedHourlySessionOffered;

        if (response && response.creatorUser) {
          this.userTitle = response.creatorUser.roleNames.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Student';
        }
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onTabClick(index: number): void {
    this.showPayButton = index === 1;
  }

  getFormatedDuration(startTime: Date, endTime: Date): string {
    const duration = this.calculateDuration(moment(startTime), moment(endTime));
    return this.formatDuration(duration);
  }

  onAddSessionClick(): void {
    const model = new CalendarEventDto();
    model.projectId = this.projectOffer.projectId;
    model.startTime = moment().set({ second: 0 });
    model.endTime = model.startTime;
    this.showCreateEditBookingModal(model);
  }

  onEditSessionClick(model: CalendarEventDto): void {
    this.forEdit = model;
    this.showCreateEditBookingModal(_.cloneDeep(model));
  }

  onRemoveSessionClick(model: CalendarEventDto): void {
    const sessionIndex = this.sessions.indexOf(model);
    if (sessionIndex >= 0) {
      this.sessions.splice(sessionIndex, 1);
    }
  }

  onPayClick(): void {
    this.isLoading = true;
    this._projectOffersService.accept(this.projectOffer.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        const newSessions = this.sessions.filter(s => !s.id);
        this._calendarEventsService.createBatch(newSessions)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._router.navigate([`/app/projects/${this.projectOffer.projectId}/hired`]);
            this._modal.hide();
          });
      });
  }

  private showCreateEditBookingModal(model?: CalendarEventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditBookingComponent>;
    modalSettings.initialState = {
      model: model,
      isFromViewOffer: true,
    };
    const modal = this._modalService.show(CreateEditBookingComponent, modalSettings).content;
    modal.modelAdded
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe((event: CalendarEventDto) => {
        console.log(event.startTime);
        if (event) {
          const sessionIndex = this.sessions.indexOf(this.forEdit);
          if (sessionIndex >= 0) {
            this.sessions.splice(sessionIndex, 1);
          }
          this.sessions.push(event);
        }
        delete this.forEdit;

        this.sessions = _.orderBy(this.sessions, (s: CalendarEventDto) => s.startTime, ['asc']);
      });
  }
}
