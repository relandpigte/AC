import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { VideoDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videoCreated$: Observable<VideoDto>;
  private _videoCreatedSubject: BehaviorSubject<VideoDto>;

  constructor() {
    this._videoCreatedSubject = new BehaviorSubject<VideoDto>(undefined);
    this.videoCreated$ = this._videoCreatedSubject.asObservable();
  }

  public set videoCreated(value: VideoDto) {
    this._videoCreatedSubject.next(value);
  }
}
