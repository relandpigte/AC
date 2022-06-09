import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { WorkHistoriesServiceProxy, WorkHistoryDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { ProfileService } from '../_services/profile.service';
import { AddExperienceComponent } from './_components/add-experience/add-experience.component';
@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.less']
})

export class ExperienceComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;

  workHistories: WorkHistoryDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _profileService: ProfileService,
    private _modalService: BsModalService,
    private _workHistoryService: WorkHistoriesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._profileService.user$.subscribe(user => {
      if (user && user.id) {
        this.userId = user.id;
        this.getUserWorkHistories();
      }
    });
  }

  private getUserWorkHistories(): void {
    this.isLoading = true;
    this._workHistoryService.getAll(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.isLoading = false),
      )
      .subscribe(workHistories => {
        this.workHistories = workHistories;
      });
  }

  private showCreateEditUserEducationModal() {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    const modalRef = this._modalService.show(AddExperienceComponent, modalSettings);
    modalRef.content.onSave
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getUserWorkHistories();
      });
  }

  onAddClick() {
    this.showCreateEditUserEducationModal();
  }

  onDeleteClick(workHistory){
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this._workHistoryService.delete(workHistory.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.getUserWorkHistories();
          });
        }
      }
    );

  }
}
