import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateProjectDto } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class ServiceWizardService {

  public currentStep$: Observable<CreateProjectDto>;
  private _currentStepSubject: BehaviorSubject<CreateProjectDto>;

  private newProject = 'newProject';

  constructor() {
    const projectDto = this.getFromLocalStorage();
    this._currentStepSubject = new BehaviorSubject<CreateProjectDto>(projectDto);
    this.currentStep$ = this._currentStepSubject.asObservable();
  }

  public set currentStep(value: CreateProjectDto) {
    this._currentStepSubject.next(value);
    this.saveToLocalStorage(value);
  }

  clear(): void {
    this.currentStep = null;
    localStorage.removeItem(this.newProject);
  }


  private saveToLocalStorage(value: CreateProjectDto): void {
    const item = JSON.stringify(value);
    localStorage.setItem(this.newProject, item);
  }

  private getFromLocalStorage(): CreateProjectDto {
    const item = localStorage.getItem(this.newProject);
    return JSON.parse(item);
  }
}
