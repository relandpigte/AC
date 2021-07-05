import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { BecomeATutorStep, ReferenceDto, ReferenceDtoPagedResultDto, ReferenceRelationshipType, ReferencesServiceProxy, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { pipe } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';
import { CreateEditReferenceComponent } from './create-edit-reference/create-edit-reference.component';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.less']
})
export class ReferencesComponent extends PagedListingComponentBase<ReferenceDto> {
  references: ReferenceDto[] = [];
  headers: TableHeaderSortData[] = [
    { title: 'Forename', sortColumn: 'forename' },
    { title: 'Surname', sortColumn: 'surname' },
    { title: 'Email', sortColumn: 'email' },
    { title: 'Phone', sortColumn: 'phone' },
    { title: 'Relationship', sortColumn: 'relationship', colspan: 2, },
  ];
  userId: number;
  isReadOnly: boolean;

  ReferenceRelationshipType = ReferenceRelationshipType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _becomeATutorService: BecomeATutorService,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _referencesService: ReferencesServiceProxy,
    private _appSession: AppSessionService
  ) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;

    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this._appSession.userId;
      this.isReadOnly = (this.userId !== this._appSession.userId);
    });
  }

  list(request: PagedAndSortedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._referencesService
      .getAll(
        this.userId,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        this.references = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onNextClick(): void {
    this.isTableLoading = true;
    this._tutorWizardService.updateStep(BecomeATutorStep.References)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isTableLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateNextStep();
      });
  }

  onAddClick(): void {
    this.showCreateEditReferenceModal();
  }

  onEditClick(reference: ReferenceDto): void {
    this.showCreateEditReferenceModal(_.cloneDeep(reference));
  }

  onDeleteClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.isTableLoading = true;
          this._referencesService.delete(id)
            .pipe(
              takeUntil(this.destroyed$),
              pipe(finalize(() => {
                this.isTableLoading = false;
              }))
            )
            .subscribe(() => {
              this.notify.success('SuccessfullyDeleted');
              this.pageNumber = 1;
              this.refresh();
            })
        }
      }
    );
  }

  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/dbs-check`]);
  }

  onBackClick(): void {
    if (this.isReadOnly) {
      this._router.navigate([`app/tutor-applications/${this.userId}/contact-number`]);
    } else {
      this._router.navigate([`app/tutor-wizard/contact-number`]);
    }
  }

  private showCreateEditReferenceModal(reference?: ReferenceDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditReferenceComponent>;
    modalSettings.initialState = {
      model: reference,
    };
    const modal = this._modalService.show(CreateEditReferenceComponent, modalSettings).content;
    modal.referenceSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.refresh();
      });
  }

  private updateNextStep(): void {
    this.isTableLoading = true;
    const nextStep = BecomeATutorStep.DbsCheck;
    this._tutorWizardService.updateStep(nextStep)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isTableLoading = false;
        }),
      )
      .subscribe((result) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._becomeATutorService.currentStep = nextStep;
        this._becomeATutorService.currentTutorWizardStep = result;
      });
  }
}
