import { Injectable } from '@angular/core';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorPortalService {
  public video$: Observable<VideoDto>;

  private _videoSubject: BehaviorSubject<VideoDto>;

  constructor() {
    this._videoSubject = new BehaviorSubject<VideoDto>(new VideoDto());
    this.video$ = this._videoSubject.asObservable();
  }

  public set video(value: VideoDto) {
    this._videoSubject.next(value);
  }
}
