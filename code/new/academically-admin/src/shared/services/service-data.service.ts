import { Injectable } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';

import { CreateServiceDiscussionDto, PostsServiceProxy, PostType, ServiceDiscussionServiceProxy, ServicesType } from '../service-proxies/service-proxies';
import { BehaviorSubject, Observable } from '@node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {
  public discussionId$: Observable<string>;
  public serviceData$: Observable<any>;
  public serviceRating$: Observable<any>;

  private _discussionId: BehaviorSubject<string>;
  private _serviceData: BehaviorSubject<any>;
  private _serviceRating: BehaviorSubject<any>;

  constructor(
    private _postsService: PostsServiceProxy,
    private _serviceDiscussion: ServiceDiscussionServiceProxy
  ) {
    this._discussionId = new BehaviorSubject<string>(null);
    this.discussionId$ = this._discussionId.asObservable();

    this._serviceData = new BehaviorSubject<any>(null);
    this.serviceData$ = this._serviceData.asObservable();

    this._serviceRating = new BehaviorSubject<any>(null);
    this.serviceRating$ = this._serviceRating.asObservable();
  }

  public set serviceData(value: any) {
    this._serviceData.next(value);
  }

  public set discussionId(value: string) {
    this._discussionId.next(value);
  }

  public set serviceRating(value: any) {
    this._serviceRating.next(value);
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
      undefined
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
