import { Component, ContentChild, ElementRef, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FileParameter } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.less']
})
export class DocumentUploaderComponent extends AppComponentBase implements OnInit {
  @ContentChild('test') layoutTemplate: TemplateRef<any>;
  @Input() allowedExtensions: string[] = [];
  @Input() maxFiles: number;
  @Input() cropImages = false;
  @Input() hasCategory = false;
  @Output() filesChanged = new EventEmitter<FileParameter[]>();
  @ViewChild('documentUploader') documentUploaderInput: ElementRef;
  public files: File[] = [];
  public categories: string[] = [];

  loadingImageCropper = false;
  categorySource = [
    'Certificate',
    'Transcript',
  ];

  private _imageExtensions = [
    'jpg',
    'jpeg',
    'png',
  ];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFileChange(e: any) {
    const file = e.target.files[0] as File;
    const fileExtension = this.getFileExtension(file.name).toLowerCase();

    if (this.maxFiles && this.files.length === this.maxFiles) {
      const sFile = this.maxFiles > 1 ? `${this.maxFiles} files` : '1 file';
      this.notify.error(`You are allowed to upload only ${sFile} at a time.`)
    }

    if (this.allowedExtensions.includes(`.${fileExtension}`)) {
      if (this.cropImages && this._imageExtensions.includes(fileExtension)) {
        this.loadingImageCropper = true;
        const modalSettings = this.defaultModalSettings;
        modalSettings.initialState = {
          image: file,
        };
        const modal = this._modalService.show(ImageCropperComponent, modalSettings);
        const imageCropper: ImageCropperComponent = modal.content;
        imageCropper.imageLoaded.subscribe(() => {
          this.loadingImageCropper = false;
        });
        imageCropper.imageCropped.subscribe((file: File) => {
          if (this.hasCategory) {
            this.categories.push('');
          }
          this.files.push(file);
          this.filesChanged.emit(this.getFileParameterFromFiles());
          imageCropper.close();
        });
      } else {
        if (this.hasCategory) {
          this.categories.push('');
        }
        this.files.push(file);
        this.filesChanged.emit(this.getFileParameterFromFiles());
      }
    } else {
      this.notify.error(`The file with extension <b>${fileExtension}</b> is not not allowed.`);
    }

    this.documentUploaderInput.nativeElement.value = '';
  }

  onRemoveFileClick(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
    this.filesChanged.emit(this.getFileParameterFromFiles());
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onOpenDocumentClick(file: File): void {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  }

  public getFileParameterFromFiles(): FileParameter[] {
    return this.files.map(file => {
      const fileParameter: FileParameter = {
        fileName: file.name,
        data: file,
      };
      return fileParameter;
    })
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
}
