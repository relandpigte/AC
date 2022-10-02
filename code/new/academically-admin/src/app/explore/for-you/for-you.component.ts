import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, DateGrains, VideoDtoPagedResultDto, EventDto, EventsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import * as moment from 'moment';
import * as _ from 'lodash';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-explore-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreForYouComponent extends AppComponentBase implements OnInit {

  top3Tutorials: VideoDto[] = Array(3).fill([]).map(() => this.generateRandomTutorial()) as VideoDto[];
  top3UpcomingEvent: EventDto[] = Array(3).fill([]).map(() => this.generateRandomEvent()) as EventDto[];

  top3VideosData: VideoDtoPagedResultDto;

  isLoadingTutorials = true;
  isLoadingEvents = true;

  constructor(
    injector: Injector,
    private _videoService: VideosServiceProxy,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadDataTutorials();    
    this.loadDataEvents();
  }

  private loadDataTutorials(): void {
    this.isLoadingTutorials = true;
    this._videoService.getByDates(this.appSession.userId, undefined, undefined, undefined, DateGrains.Monthly, undefined, 3)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingTutorials = false))
      .subscribe(videos => {       
        if (videos) {          
          this.top3Tutorials = [];

          Object.keys(videos).forEach(range => {
            this.top3VideosData = videos[range];              
          });
        } 
    });
  }

  private loadDataEvents(): void {
    this.isLoadingEvents = true;
    this._eventsService.getByDates(DateGrains.Monthly, 3)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingEvents = false))
      .subscribe(events => {
        if (events) {
          this.top3UpcomingEvent = [];
          Object.keys(events).forEach(range => {
            this.top3UpcomingEvent = _.concat(this.top3UpcomingEvent, events[range]);
          });
        }        
    });
  }
  
}