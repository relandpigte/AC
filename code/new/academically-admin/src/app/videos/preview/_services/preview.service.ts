import { Injectable } from '@angular/core';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  public video$: Observable<VideoDto>;
  public preview$: Observable<boolean>;

  private _videoSubject: BehaviorSubject<VideoDto>;
  private _previewSubject: BehaviorSubject<boolean>;

  constructor() {
    this._videoSubject = new BehaviorSubject<VideoDto>(new VideoDto());
    this.video$ = this._videoSubject.asObservable();

    this._previewSubject = new BehaviorSubject<boolean>(true);
    this.preview$ = this._previewSubject.asObservable();
  }

  public set video(value: VideoDto) {
    this._videoSubject.next(value);
  }

  public set preview(value: boolean) {
    this._previewSubject.next(value);
  }
}
