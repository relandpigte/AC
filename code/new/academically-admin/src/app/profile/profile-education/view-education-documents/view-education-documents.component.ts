import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentDto, DocumentsServiceProxy, UserEducationDocumentDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-education-documents',
  templateUrl: './view-education-documents.component.html',
  styleUrls: ['./view-education-documents.component.less']
})
export class ViewEducationDocumentsComponent extends AppComponentBase {
  @Input() userEducationDocuments: UserEducationDocumentDto[] = [];
  viewLoaders: boolean[] = [];
  deleteLoaders: boolean[] = [];

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _documentsService: DocumentsServiceProxy,
    private _userEducationsService: UserEducationsServiceProxy,
  ) {
    super(injector);
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
          this._userEducationsService.deleteDocument(id)
            .pipe(finalize(() => {
              this.deleteLoaders[id] = true;
            }))
            .subscribe(() => {
              const index = this.userEducationDocuments.findIndex(e => e.id === id);
              if (index >= 0) {
                this.userEducationDocuments.splice(index, 1);
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
