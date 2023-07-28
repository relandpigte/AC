import { AfterViewInit, Component, ElementRef, Injector, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-attachment-viewer',
    templateUrl: './attachment-viewer.component.html',
    styleUrls: ['./attachment-viewer.component.less'],
    animations: [appModuleAnimation()]
})
export class AttachmentViewerComponent extends AppComponentBase implements OnChanges, AfterViewInit {
    @ViewChild('attachment', { read: ElementRef }) attachment: ElementRef<HTMLElement>;

    url: SafeUrl;
    downloadUrl: string;
    extension: string;

    canDownload: boolean = false;

    private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
    private videoExtensions = fileUploadConfiguration.videoExtensions;

    constructor(
        injector: Injector,
        private _modalRef: BsModalRef,
        private _renderer: Renderer2
    ) {
        super(injector);
    }

    get isImageAttachment(): boolean { return this.imageExtensions.some(x => x === `.${this.extension}`); }
    get isVideoAttachment(): boolean { return this.videoExtensions.some(x => x === `.${this.extension}`); }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngAfterViewInit(): void {
        if (this.attachment) {
            const dimension = this.attachment.nativeElement.getBoundingClientRect();
            if (dimension.width > dimension.height) {
                this._renderer.setStyle(this.attachment.nativeElement, 'width', '100vw');
            } else {
                this._renderer.setStyle(this.attachment.nativeElement, 'height', '100vh');
            }
        }
    }

    onDownloadClick(): void {
        if (this.canDownload) {
            window.open(this.downloadUrl, '_blank');
        }
    }

    onCloseClick(): void {
        this._modalRef.hide();
    }
}
