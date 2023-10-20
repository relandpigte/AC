import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardPagesService {
    public isLoading$ = new BehaviorSubject<boolean>(true);
    public currentTab$ = new BehaviorSubject<string>(null);

    public setIsLoading(isLoading: any): void {
        this.isLoading$.next(isLoading);
    }

    public setCurrentTab(tab: string): void {
        this.currentTab$.next(tab);
    }
}
