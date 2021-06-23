import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { ProjectDto, ProjectsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ProjectService } from '../_services/project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<ProjectDto> {
  constructor(
    private _router: Router,
    private _projectService: ProjectService,
    private _projectsService: ProjectsServiceProxy
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProjectDto> {
    abp.ui.setBusy();
    let projectId = route.paramMap.get('project-id');
    projectId = projectId ? projectId : '00000000-0000-0000-0000-000000000000';
    return this._projectsService
      .get(projectId)
      .pipe(
        tap(project => {
          if (!project || !project.id ) {
            this._router.navigate(['/pages/403']);
          }
          this._projectService.project = project;
        }),
        finalize(() => {
          abp.ui.clearBusy();
        })
      );
  }
}
