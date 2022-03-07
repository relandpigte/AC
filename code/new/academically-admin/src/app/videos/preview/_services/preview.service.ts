import { Injectable } from '@angular/core';
import { VideoDto, GetStudentVideoDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  public video$: Observable<VideoDto>;
  public preview$: Observable<boolean>;
  public studentVideo$: Observable<GetStudentVideoDto>;

  private _videoSubject: BehaviorSubject<VideoDto>;
  private _previewSubject: BehaviorSubject<boolean>;
  private _studentVideoSubject: BehaviorSubject<GetStudentVideoDto>;

  constructor() {
    this._videoSubject = new BehaviorSubject<VideoDto>(new VideoDto());
    this.video$ = this._videoSubject.asObservable();

    this._previewSubject = new BehaviorSubject<boolean>(true);
    this.preview$ = this._previewSubject.asObservable();

    this._studentVideoSubject = new BehaviorSubject<GetStudentVideoDto>(undefined);
    this.studentVideo$ = this._studentVideoSubject.asObservable();
  }

  public set video(value: VideoDto) {
    this._videoSubject.next(value);
  }

  public set preview(value: boolean) {
    this._previewSubject.next(value);
  }

  public set studentVideo(value: GetStudentVideoDto) {
    this._studentVideoSubject.next(value);
  }
}
