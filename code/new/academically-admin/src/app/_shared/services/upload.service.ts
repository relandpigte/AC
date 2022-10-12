import { Injectable } from '@angular/core';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentDto, DocumentsServiceProxy, DocumentType } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private _configuration = environment.providers.amazon.s3;

  constructor(
    private _appSession: AppSessionService,
    private _documentsService: DocumentsServiceProxy,
  ) { }

  getFileUrl(document: DocumentDto): string {
    if (document) {
      const key = this.getKey(document.creatorUserId, document.name, document.documentType);
      return `https://${this._configuration.bucket}.s3.${this._configuration.region}.amazonaws.com/${key}`;
    }
    return '';
  }

  upload(file: File, type: DocumentType, referenceId?: string): Observable<DocumentDto> {
    const client = this.getClient();
    const originalFileName = file.name;
    const fileName = `${moment().unix().toString()}.${this.getExtension(originalFileName)}`;
    const key = this.getKey(this._appSession.userId, fileName, type);

    return from(client.send(new PutObjectCommand({
      Bucket: this._configuration.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read',
    }))).pipe(
      switchMap(() => {
        const document = new DocumentDto();
        document.name = fileName;
        document.originalFileName = file.name;
        document.fileType = file.type;
        document.documentType = type;
        document.size = file.size;
        return this._documentsService.create(referenceId, document);
      }),
    );
  }

  delete(document: DocumentDto, referenceId?: string): Observable<any> {
    const client = this.getClient();
    const key = this.getKey(document.creatorUserId, document.name, document.documentType);

    return from(client.send(new DeleteObjectCommand({
      Bucket: this._configuration.bucket,
      Key: key,
    }))).pipe(
      switchMap(() => {
        return this._documentsService.delete(document.id, referenceId);
      })
    );
  }

  private getClient(): S3Client {
    return new S3Client({
      region: this._configuration.region,
      credentials: {
        accessKeyId: this._configuration.credentials.accessKey,
        secretAccessKey: this._configuration.credentials.secret,
      }
    });
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
      case DocumentType.WorkshopThumbnail:
        folder = folders.workshopThumbnail;
        break;
    }
    return folder;
  }
}
