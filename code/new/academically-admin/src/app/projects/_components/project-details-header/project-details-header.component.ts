import { Component, Injector, Input, OnInit } from '@angular/core';
import { ProjectService } from '@app/projects/_services/project.service';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-header',
  templateUrl: './project-details-header.component.html',
  styleUrls: ['./project-details-header.component.less']
})
export class ProjectDetailsHeaderComponent extends AppComponentBase implements OnInit {
  projectName: string;

  constructor(
    injector: Injector,
    private _projectService: ProjectService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._projectService.project$.subscribe(project => {
      if (project) {
        this.projectName = project.name;
      }
    });
  }
}
