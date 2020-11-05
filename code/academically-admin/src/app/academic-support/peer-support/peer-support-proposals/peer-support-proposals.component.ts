import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProposalsServiceProxy, SearchTutorDto, EducationLevel } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'peer-support-proposals',
  templateUrl: './peer-support-proposals.component.html',
  styleUrls: ['./peer-support-proposals.component.less'],
  animations: [appModuleAnimation()]
})
export class PeerSupportProposalsComponent extends AppComponentBase implements OnInit {
  tutors: SearchTutorDto[] = [];
  educationLevels: number[] = [];
  distanceFilter = -1;
  educationLevelFilter = 100;

  constructor(
    injector: Injector,
    private _proposalsServiceProxy: ProposalsServiceProxy) {
      super(injector);
    }

  ngOnInit(): void {
    this.searchTutors();
    this.getEducationLevels();
  }

  onDistanceFilterChange(): void {
    this.searchTutors();
  }

  onEducationLevelFilterChange(): void {
    this.searchTutors();
  }

  private getEducationLevels(): void {
    this.educationLevels = this.enumToArray(EducationLevel).reverse();
  }

  private searchTutors(): void {
    this._proposalsServiceProxy.searchTutors(this.distanceFilter, this.educationLevelFilter).subscribe(tutors => {
      this.tutors = tutors;
    });
  }
}
