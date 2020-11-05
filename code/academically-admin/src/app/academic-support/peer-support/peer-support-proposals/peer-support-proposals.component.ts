import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProposalsServiceProxy, SearchTutorDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'peer-support-proposals',
  templateUrl: './peer-support-proposals.component.html',
  styleUrls: ['./peer-support-proposals.component.less'],
  animations: [appModuleAnimation()],
})
export class PeerSupportProposalsComponent implements OnInit {
  tutors: SearchTutorDto[] = [];
  distanceFilter = -1;

  constructor(private _proposalsServiceProxy: ProposalsServiceProxy) {}

  ngOnInit(): void {
    this.searchTutors();
  }

  onDistanceFilterChange(): void {
    this.searchTutors();
  }

  private searchTutors(): void {
    this._proposalsServiceProxy.searchTutors(this.distanceFilter).subscribe((tutors) => {
      this.tutors = tutors;
    });
  }
}
