import { Component, ElementRef, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileUtils } from '@shared/helpers/file-utils';

@Component({
    selector: 'app-attachment-preview',
    templateUrl: './attachment-preview.component.html',
    styleUrls: ['./attachment-preview.component.scss'],
    animations: [appModuleAnimation()]
})
export class AttachmentPreviewComponent extends AppComponentBase implements OnChanges {
    @Input() file: File;

    @Output() onRemove = new EventEmitter<any>();

    @ViewChild('videoAttachment') videoAttachment: ElementRef;

    sanitizedAttachmentUrl: SafeUrl;
    private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
    private videoExtensions = fileUploadConfiguration.videoExtensions;
    private fileExtensions = fileUploadConfiguration.allowedFileExtensions;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('file' in changes && this.file) {
            this.sanitizedAttachmentUrl = FileUtils.getSanitizedFileUrl(this, this.file);
        }
    }

    get fileAttachmentName(): string { return FileUtils.getFileName(this.file?.name); }
    get fileAttachmentType(): string { return FileUtils.getFileExtension(this.file?.name).replace(/\./g, ''); }
    get fileAttachmentSize(): string { return this.formatBytes(this.file?.size, 2); }
    get isImageAttachment(): boolean { return this.imageExtensions.some(x => x === `.${FileUtils.getFileExtension(this.file?.name)}`); }
    get isVideoAttachment(): boolean { return this.videoExtensions.some(x => x === `.${FileUtils.getFileExtension(this.file?.name)}`); }
    get isFileAttachment(): boolean { return this.fileExtensions.some(x => x === `.${FileUtils.getFileExtension(this.file?.name)}`); }
    get isShowAttachmentInfo(): boolean { return !this.isImageAttachment; }
    get isVideoPlaying(): boolean {
        const video = this.videoAttachment?.nativeElement;
        return video && !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    }

    removeAttachment(): void {
        this.onRemove.emit();
    }

    togglePlayVideo(): void {
        if (this.isVideoPlaying) this.videoAttachment.nativeElement.pause();
        else this.videoAttachment.nativeElement.play()
    }
}
