import { Injectable } from '@angular/core';
import { ProjectDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public project$: Observable<ProjectDto>;
  private _project: BehaviorSubject<ProjectDto>;

  constructor() {
    this._project = new BehaviorSubject<ProjectDto>(null);
    this.project$ = this._project.asObservable();
   }

  public set project(value: ProjectDto) {
    this._project.next(value);
  }
}
