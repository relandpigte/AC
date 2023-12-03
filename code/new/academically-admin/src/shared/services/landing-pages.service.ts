import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LandingPagesService {
    public isLoading$ = new BehaviorSubject<boolean>(false);

    public setIsLoading(isLoading: any): void {
        this.isLoading$.next(isLoading);
    }
}
