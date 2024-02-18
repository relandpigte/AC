import { ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { FileUtils } from '@shared/helpers/file-utils';
import { ServiceHandoutDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { ServiceHandoutsStateService } from '@shared/services/service-handouts-state.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class HandoutsComponent extends AppComponentBase implements OnInit, OnDestroy {
  serviceHandoutsStateService: ServiceHandoutsStateService;

  @Input() referenceId: string;
  @Input() isHost = false;

  handouts: ServiceHandoutDto[] = [];
  totalHandoutsCount = 0;

  isDownloadingFileMap$: { [key: string]: BehaviorSubject<boolean> } = {};
  isLoadingList$ = new BehaviorSubject<boolean>(true);

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _uploadService: UploadService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  async ngOnInit() {
    await this.initServiceHandoutsStateService();
  }

  async ngOnDestroy() {
    await this.serviceHandoutsStateService?.stop();
  }

  get serviceHandoutsStateId(): string { return 'service-handouts-event'; }

  private async initServiceHandoutsStateService() {
    const appStateConfig: AppStateConfig = {
      [this.serviceHandoutsStateId]: {
        load: [this.referenceId],
        update: { referenceId: this.referenceId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.serviceHandoutsStateId]: {
        type: ServiceHandoutsStateService,
        args: [this.appSession, this._hubService, this._servicesService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.serviceHandoutsStateService = this.pubSubService.getStateService<ServiceHandoutsStateService>(this.serviceHandoutsStateId);
    this.serviceHandoutsStateService.handouts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
        if (!event.data) return;
        switch (event.type) {
            case StateUpdateType.Add:
              this.handouts = [event.data].concat(this.handouts);
              this.totalHandoutsCount++;
              break;
            case StateUpdateType.Update:
              if (event.silent) {
                this.handouts = this.handouts.map(c => c.id === event.data.id ? event.data : c);
              } else {
                const idx = this.handouts.findIndex(c => c.id === event.data.id);
                this.handouts.splice(idx, 1);
                this.handouts = [event.data].concat(this.handouts);
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
    var anchor = document.createElement('a');
    anchor.classList.add('offscreen');
    anchor.download = handout.document.originalFileName;
    anchor.href = blobUrl;
    anchor.click();
    this.isDownloadingFileMap$[handout.id].next(false);
    this._cdr.detectChanges();
  }
}
