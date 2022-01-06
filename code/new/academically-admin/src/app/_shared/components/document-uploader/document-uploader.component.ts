import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';

export class DefaultFile {
  name: string;
  url: string | SafeUrl;
  size: number;
}

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.less']
})
export class DocumentUploaderComponent extends AppComponentBase implements OnInit {
  @Input() allowedExtensions: string[] = [];
  @Input() maxFiles: number;
  @Input() cropImages = false;
  @Input() cropperAspectRatioWidth = 1;
  @Input() cropperAspectRationHeight = 1;
  @Input() hasCategory = false;
  @Input() previewImages = false;
  @Input() largeImagePreview = false;
  @Input() hasRemoveButton = true;
  @Input() defaultFile: DefaultFile;
  @Input() noFilePlaceholder = this.l('DropFileOrClickHereToUpload');
  @Input() placeholderHeight = 'initial';
  @Input() maxFileSize = fileUploadConfiguration.maxFileSize;
  @Output() filesChanged = new EventEmitter<FileParameter[]>();
  @Output() defaultFileRemoved = new EventEmitter();
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
    private _sanitizer: DomSanitizer,
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
      this.notify.error(`You are allowed to upload only ${sFile} at a time.`);
    }

    if (this.allowedExtensions.length && !this.allowedExtensions.includes(`.${fileExtension}`)) {
      this.notify.error(this.l('InvalidFileExtensionUploadError', fileExtension), this.l('InvalidFileUploadError'));
      return;
    }

    if (this.cropImages && this._imageExtensions.includes(fileExtension)) {
      this.loadingImageCropper = true;
      const modalSettings = this.defaultModalSettings;
      modalSettings.initialState = {
        image: file,
      };
      const modal = this._modalService.show(ImageCropperComponent, modalSettings);
      const imageCropper: ImageCropperComponent = modal.content;
      imageCropper.aspectRatioWidth = this.cropperAspectRatioWidth;
      imageCropper.aspectRationHeight = this.cropperAspectRationHeight;
      imageCropper.maintainAspectRatio = this.cropperAspectRatioWidth > 1 || this.cropperAspectRationHeight > 1;
      imageCropper.imageLoaded.subscribe(() => {
        this.loadingImageCropper = false;
      });
      imageCropper.imageCropped.subscribe((croppedFile: File) => {
        if (this.hasCategory) {
          this.categories.push('');
        }
        if (this.validateFileSize(croppedFile.size)) {
          this.files.push(croppedFile);
          this.filesChanged.emit(this.getFileParameterFromFiles());
        }
        imageCropper.close();
      });
    } else {
      if (this.hasCategory) {
        this.categories.push('');
      }
      if (this.validateFileSize(file.size)) {
        this.files.push(file);
        this.filesChanged.emit(this.getFileParameterFromFiles());
      }
    }

    this.documentUploaderInput.nativeElement.value = '';
  }

  onRemoveFileClick(fileIndex: number) {
    if (this.hasCategory) {
      this.categories.splice(fileIndex, 1);
    }
    this.files.splice(fileIndex, 1);
    this.filesChanged.emit(this.getFileParameterFromFiles());
  }

  onRemoveDefaultFileClick(): void {
    this.defaultFile = undefined;
    this.defaultFileRemoved.emit();
    this.filesChanged.emit([]);
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }

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
    });
  }

  public getSanitizedFileUrl(file: File): SafeUrl {
    return this._sanitizer.bypassSecurityTrustUrl(this.getFileUrl(file));
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }

  private getFileUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  private validateFileSize(size: number) {
    if (this.maxFileSize > 0) {
      const isValid = size <= this.maxFileSize;
      if (!isValid) {
        this.notify.error(this.l('InvalidFileSizeUploadError', '5MB'), this.l('InvalidFileUploadError'));
      }
      return isValid;
    }

    return true;
  }
}
