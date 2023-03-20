import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private isLoading$ = new BehaviorSubject<boolean>(true);

  setIsLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }

  getIsLoading$() {
    return this.isLoading$.asObservable();
  }
}
