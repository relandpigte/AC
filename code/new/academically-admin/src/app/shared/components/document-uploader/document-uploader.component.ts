import { Component, Input, OnInit } from '@angular/core';
import { NotifyService } from 'abp-ng2-module';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.less']
})
export class DocumentUploaderComponent implements OnInit {
  @Input() allowedExtensions: string[] = [];
  public files: File[] = [];

  constructor(
    private notify: NotifyService,
  ) { }

  ngOnInit(): void {
  }

  onFileChange(e: any) {
    const file = e.target.files[0] as File;
    const fileExtension = this.getFileExtension(file.name).toLowerCase();
    if (this.allowedExtensions.includes(`.${fileExtension}`)) {
      this.files.push(file);
    } else {

      this.notify.error(`The file with extension <b>${fileExtension}</b> is not not allowed.`);
    }
  }

  onRemoveFileClick(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
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

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
}
