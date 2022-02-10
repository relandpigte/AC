import { Injectable } from '@angular/core';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommentsComponent } from '../_components/comments/comments.component';

@Injectable({
  providedIn: 'root'
})
export class TutorPortalService {
  public video$: Observable<VideoDto>;
  public commentsUpdated$: Observable<CommentsComponent>;

  private _videoSubject: BehaviorSubject<VideoDto>;
  private _commentsUpdatedSubject: BehaviorSubject<CommentsComponent>;

  constructor() {
    this._videoSubject = new BehaviorSubject<VideoDto>(new VideoDto());
    this.video$ = this._videoSubject.asObservable();

    this._commentsUpdatedSubject = new BehaviorSubject<CommentsComponent>(undefined);
    this.commentsUpdated$ = this._commentsUpdatedSubject.asObservable();
  }

  public set video(value: VideoDto) {
    this._videoSubject.next(value);
  }

  public set commentsUpdated(value: CommentsComponent) {
    this._commentsUpdatedSubject.next(value);
  }
}
