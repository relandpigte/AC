import { Component, OnInit, Input, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { UploadService } from '@app/_shared/services/upload.service';
import { DocumentType, FileParameter } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { AudioComponentContent } from '@app/content-builder/_models/audio-component-content';

@Component({
  selector: 'app-audio-component-editor',
  templateUrl: './audio-component-editor.component.html',
  styleUrls: ['./audio-component-editor.component.less']
})
export class AudioComponentEditorComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  isLoading = false;

  audioExtensions = fileUploadConfiguration.audioExtensions;
  defaultFile: DefaultFile;
  audioComponentContent: AudioComponentContent = new AudioComponentContent();

  constructor(
    injector: Injector,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  @Input() set component(value: AudioComponentContent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.audioComponentContent = value;
    if (this.audioComponentContent.audioDocument) {
      this.setDefaultFile();
    }
  }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        const file = files[0].data as File;
        this.isLoading = true;
        this._uploadService.upload(file, DocumentType.CourseSectionImage)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(async response => {
            this.audioComponentContent.audioDocument = response;
            this.documentUploader.files = [];
            await this.setDefaultFile();
          });
      } else {
        this.audioComponentContent.audioDocument = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      if (this.audioComponentContent.audioDocument) {
        this.isLoading = true;
        this._uploadService.delete(this.audioComponentContent.audioDocument)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.audioComponentContent.audioDocument = undefined;
          });
      }
    });
  }

  private async setDefaultFile(): Promise<void> {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.audioComponentContent.audioDocument.originalFileName;
    this.defaultFile.url = await this._uploadService.getFileUrl(this.audioComponentContent.audioDocument);
    this.defaultFile.size = this.audioComponentContent.audioDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
