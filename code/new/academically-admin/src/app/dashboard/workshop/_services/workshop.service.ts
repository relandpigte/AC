import { Injectable } from '@angular/core';
import { WorkshopDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  public workshopCreated$: Observable<WorkshopDto>;

  private _workshopCreatedSubject: BehaviorSubject<WorkshopDto>;

  constructor() {
    this._workshopCreatedSubject = new BehaviorSubject<WorkshopDto>(undefined);
    this.workshopCreated$ = this._workshopCreatedSubject.asObservable();
  }

  public set workshopCreated(value: WorkshopDto) {
    this._workshopCreatedSubject.next(value);
  }
}
