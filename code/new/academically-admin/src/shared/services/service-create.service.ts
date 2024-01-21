import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  iconHover?: string;
  infoText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceCreateService {
  private defaultMenuItem$: BehaviorSubject<MenuItem> = new BehaviorSubject(null);

  getDefaultMenuItem(): Observable<MenuItem> {
    return this.defaultMenuItem$.asObservable();
  }

  setDefaultMenuItem(item: MenuItem): void {
    this.defaultMenuItem$.next(item);
  }
}
