import { Injectable } from '@angular/core';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentDto, DocumentType, DocumentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private _configuration = environment.providers.amazon.s3;

  constructor(
    private _appSession: AppSessionService,
    private _documentsService: DocumentsServiceProxy,
  ) { }

  async getFileData(document: DocumentDto): Promise<string> {
    if (document) {
      return await this._documentsService.download(document.id).toPromise();
    }
    return '';
  }

  async getFileUrl(document: DocumentDto): Promise<string> {
    if (document) {
      return await this._documentsService.getSecuredUrl(document.id).toPromise();
    }
    return '';
  }

  upload(file: File, type: DocumentType, referenceId?: string): Observable<DocumentDto> {
    return this._documentsService.create(
      undefined,
      file.name,
      file.type,
      type,
      file.size,
      this._appSession.userId,
      undefined,
      referenceId,
      {
        fileName: file.name,
        data: file,
      }
    );
  }

  delete(document: DocumentDto, referenceId?: string): Observable<any> {
    return this._documentsService.delete(document.id, referenceId);
  }

  private getKey(userId: number, fileName: string, type: DocumentType): string {
    return `${userId}/${this.getFolder(type)}/${fileName}`;
  }

  private getExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.pop();
  }

  private getFolder(type: DocumentType): string {
    const folders = fileUploadConfiguration.folders;
    let folder;
    switch (type) {
      case DocumentType.Video:
        folder = folders.video;
        break;
      case DocumentType.VideoThumbnail:
        folder = folders.videoThumbnail;
        break;
      case DocumentType.ArticleThumbnail:
        folder = folders.articleThumbnail;
        break;
      case DocumentType.CourseSectionImage:
        folder = folders.courseSectionImage;
        break;
      case DocumentType.CoachingThumbnail:
        folder = folders.coachingThumbnail;
        break;
      case DocumentType.EventThumbnail:
        folder = folders.eventThumbnail;
        break;
      case DocumentType.ProfilePicture:
        folder = folders.profilePicture;
        break;
      case DocumentType.EventResource:
        folder = folders.eventResource;
        break;
    }
    return folder;
  }
}
