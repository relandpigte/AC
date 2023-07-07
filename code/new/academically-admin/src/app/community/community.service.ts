import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserTopicDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private selectedTopics$ = new Subject<UserTopicDto[]>();


  setIsLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }

  getIsLoading() {
    return this.isLoading$.asObservable();
  }

  setSelectedTopics(selectedTopics) {
    this.selectedTopics$.next(selectedTopics);
  }

  getSelectedTopics() {
    return this.selectedTopics$.asObservable();
  }
}
