import { AfterViewInit, ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileUtils } from '@shared/helpers/file-utils';
import { FileParameter, ServiceHandoutDto, ServicesServiceProxy, ServicesType } from '@shared/service-proxies/service-proxies';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { ServiceHandoutsStateService } from '@shared/services/service-handouts-state.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { PortalServiceStateIds } from '../../portal.component';
import { PortalService } from '../../_services/portal.service';

export enum PollSignalAction {
  PollStarted = 100,
  VoteSubmitted,
  PollStopped,
  SharePoll,
  PollClosed,
}

@Component({
  selector: 'app-handouts',
  templateUrl: './handouts.component.html',
  styleUrls: ['./handouts.component.less']
})
export class HandoutsComponent extends AppComponentBase implements AfterViewInit {
  serviceHandoutsStateService: ServiceHandoutsStateService;

  allowedExtensions = [
    ...fileUploadConfiguration.videoExtensions,
    ...fileUploadConfiguration.allowedFileExtensions,
    ...fileUploadConfiguration.otherExtensions
  ];

  @Input() referenceId: string;
  @Input() isHost = false;

  handouts: ServiceHandoutDto[] = [];
  totalHandoutsCount = 0;

  isDownloadingFileMap$: { [key: string]: BehaviorSubject<boolean> } = {};
  isDeletingHandoutMap$: { [key: string]: BehaviorSubject<boolean> } = {};
  isSharingHandoutMap$: { [key: string]: BehaviorSubject<boolean> } = {};

  isLoadingList$ = new BehaviorSubject<boolean>(true);
  isSavingHandout$ = new BehaviorSubject<boolean>(false);

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _portalService: PortalService,
    private _modalDialogService: ModalDialogService,
    private _uploadService: UploadService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  async ngAfterViewInit() {
    setTimeout(async () => await this.initServiceHandoutsStateService());
  }

  private async initServiceHandoutsStateService() {
    this.serviceHandoutsStateService = this.pubSubService.getStateService<ServiceHandoutsStateService>(PortalServiceStateIds['handouts']);
    this.serviceHandoutsStateService.handouts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          this.handouts = this.handouts.concat([event.data]);
          this.totalHandoutsCount++;
          break;
        case StateUpdateType.Update:
          if (event.silent) {
            this.handouts = this.handouts.map(c => c.id === event.data.id ? event.data : c);
          } else {
            const idx = this.handouts.findIndex(c => c.id === event.data.id);
            this.handouts.splice(idx, 1);
            this.handouts = this.handouts.concat([event.data]);
          }
          break;
        case StateUpdateType.Delete:
          this.handouts = this.handouts.filter(c => c.id != event.data.id);
          this.totalHandoutsCount--;
          break;
      }
      this._cdr.detectChanges();
    });
    this.handouts = this.serviceHandoutsStateService.getAllHandouts();
    this.totalHandoutsCount = this.serviceHandoutsStateService.totalHandoutsCount;
  }

  isOwnedByCurrentUser(handout: ServiceHandoutDto): boolean {
    return handout.creatorUserId === this.appSession.userId;
  }

  isAlreadyShared(handout: ServiceHandoutDto): boolean {
    return !!handout.shareTime;
  }

  getHandoutFileType(handout: ServiceHandoutDto): string {
    return handout.document.originalFileName?.split('.')?.pop();
  }

  async onDownloadClick(handout: ServiceHandoutDto): Promise<void> {
    if (!(handout.id in this.isDownloadingFileMap$)) this.isDownloadingFileMap$[handout.id] = new BehaviorSubject<boolean>(false);
    this.isDownloadingFileMap$[handout.id].next(true);
    this._cdr.detectChanges();
    const fileData = await this._uploadService.getFileData(handout.document);
    const blob = await FileUtils.base64toBlob(fileData, handout.document.fileType);
    const blobUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.classList.add('offscreen');
    anchor.download = handout.document.originalFileName;
    anchor.href = blobUrl;
    anchor.click();
    this.isDownloadingFileMap$[handout.id].next(false);
    this._cdr.detectChanges();
  }

  onShareClick(handout: ServiceHandoutDto): void {
    if (!(handout.id in this.isSharingHandoutMap$)) this.isSharingHandoutMap$[handout.id] = new BehaviorSubject<boolean>(false);
    this.isSharingHandoutMap$[handout.id].next(true);
    this._servicesService.shareServiceHandout(handout.id, this._portalService.attendeeList.map(a => a.user.id))
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isSharingHandoutMap$[handout.id].next(false)))
      .subscribe(() => {});
  }

  onDeleteClick(handout: ServiceHandoutDto): void {
    const options: ModalDialogOptions = {
      title: 'Delete this handout?',
      text: 'If you are sure to delete the handout, this is an irreversible action',
      btnConfirmText: 'Delete',
      btnCancelText: 'Cancel',
      confirmCb: (): void => {
        if (!(handout.id in this.isDeletingHandoutMap$)) this.isDeletingHandoutMap$[handout.id] = new BehaviorSubject<boolean>(false);
        this.isDeletingHandoutMap$[handout.id].next(true);
        this._servicesService.deleteServiceHandout(handout.id)
          .pipe(takeUntil(this.destroyed$))
          .pipe(finalize(() => this.isDeletingHandoutMap$[handout.id].next(false)))
          .subscribe(() => {});
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onFileChanged(files: FileParameter[]): void {
    if (!files) return;
    this.isSavingHandout$.next(true)
    const file = files.pop();
    this._servicesService.saveServiceHandout(this.referenceId, ServicesType.Event, [file])
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isSavingHandout$.next(false)))
      .subscribe(() => {});
  }
}
