import { Injectable } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  CreateServiceDiscussionDto,
  PostsServiceProxy,
  PostType,
  ServiceDiscussionServiceProxy,
  ServiceRatingSummaryDto,
  ServicesType
} from '../service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {
  public discussionId$: Observable<any>;
  public serviceData$: Observable<any>;
  public serviceReview$: Observable<any>;
  public serviceReviewStats$: Observable<any>;
  public serviceReviewOverallStats$: Observable<any>;
  public serviceBooking$: Observable<any>;

  private _discussionId: BehaviorSubject<any>;
  private _serviceData: BehaviorSubject<any>;
  private _serviceReview: BehaviorSubject<any>;
  private _serviceReviewStats: BehaviorSubject<any>;
  private _serviceReviewOverallStats: BehaviorSubject<any>;
  private _serviceBooking: BehaviorSubject<any>;

  constructor(
    private _postsService: PostsServiceProxy,
    private _serviceDiscussion: ServiceDiscussionServiceProxy
  ) {
    this._discussionId = new BehaviorSubject<any>(null);
    this.discussionId$ = this._discussionId.asObservable();

    this._serviceData = new BehaviorSubject<any>(null);
    this.serviceData$ = this._serviceData.asObservable();

    this._serviceReview = new BehaviorSubject<any>(null);
    this.serviceReview$ = this._serviceReview.asObservable();

    this._serviceReviewStats = new BehaviorSubject<any>(null);
    this.serviceReviewStats$ = this._serviceReviewStats.asObservable();

    this._serviceBooking = new BehaviorSubject<any>(null);
    this.serviceBooking$ = this._serviceBooking.asObservable();

    this._serviceReviewOverallStats = new BehaviorSubject<any>(null);
    this.serviceReviewOverallStats$ = this._serviceReviewOverallStats.asObservable();
  }

  public set serviceData(value: any) {
    this._serviceData.next(value);
  }

  public set discussionId(value: any) {
    this._discussionId.next(value);
  }

  public set serviceReview(value: any) {
    this._serviceReview.next(value);
  }

  public set serviceReviewStats(value: any) {
    this._serviceReviewStats.next(value);
  }

  public set serviceReviewOverallStats(value: any) {
    this._serviceReviewOverallStats.next(value);
  }

  public set serviceBooking(value: any) {
    this._serviceBooking.next(value);
  }

  createServiceDiscussion(serviceId: string, serviceType: ServicesType, userId: number): void {
    this._postsService.create(
      `Discussion for ${ServicesType[serviceType]}: ${serviceId}`,
      undefined,
      undefined,
      PostType.Discussion,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true
    )
      .pipe(
        take(1),
        switchMap((postId: string) => {
          return this._postsService.setPostVisibility(postId, true, null, null, null);
        }),
        switchMap((postId: string) => {
          const serviceDiscussionDto = new CreateServiceDiscussionDto({
            serviceId: serviceId,
            serviceType: serviceType,
            postId: postId
          });
          this._postsService.deletePostNotification(postId, userId).subscribe();
          return this._serviceDiscussion.createServiceDiscussion(serviceDiscussionDto);
        })
      )
      .subscribe();
  }

  async getServiceDiscussionId(serviceId: string): Promise<string> {
    const serviceDiscussion = await this._serviceDiscussion.getServiceDiscussion(serviceId).toPromise();
    return serviceDiscussion?.postId;
  }
}
