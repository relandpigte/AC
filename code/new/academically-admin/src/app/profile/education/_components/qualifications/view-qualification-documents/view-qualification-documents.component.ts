import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentDto, DocumentsServiceProxy, UserQualificationDocumentDto, UserQualificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-qualification-documents',
  templateUrl: './view-qualification-documents.component.html',
  styleUrls: ['./view-qualification-documents.component.less']
})
export class ViewQualificationDocumentsComponent extends AppComponentBase implements OnInit {
  @Input() userQualificationDocuments: UserQualificationDocumentDto[] = [];
  viewLoaders: boolean[] = [];
  deleteLoaders: boolean[] = [];

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _documentsService: DocumentsServiceProxy,
    private _userQualificationsService: UserQualificationsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this._modal.hide()
  }

  onViewDocumentClick(document: DocumentDto): void {
    this.viewLoaders[document.id] = true;
    this._documentsService.getSecuredUrl(document.id)
      .pipe(finalize(() => {
        this.viewLoaders[document.id] = false;
      }))
      .subscribe(url => {
        window.open(url, '_blank');
      });
  }

  onDeleteDocumentClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.deleteLoaders[id] = true;
          this._userQualificationsService.deleteDocument(id)
            .pipe(finalize(() => {
              this.deleteLoaders[id] = true;
            }))
            .subscribe(() => {
              const index = this.userQualificationDocuments.findIndex(e => e.id === id);
              if (index >= 0) {
                this.userQualificationDocuments.splice(index, 1);
                this.notify.success('SuccessfullyDeleted');
              }
            });
        }
      }
    );
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
