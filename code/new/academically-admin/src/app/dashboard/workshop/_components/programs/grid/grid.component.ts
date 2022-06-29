import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { WorkshopDto, WorkshopType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent extends AppComponentBase implements OnInit {

  @Input() workshops: WorkshopDto[] = [];
  @Output() deleteWorkshop = new EventEmitter();
  WorkshopType = WorkshopType;
  constructor(injector: Injector, private router: Router) {
    super(injector);
   }
  ngOnInit(): void {
  }

  onDeleteClick(id: string) {
    this.deleteWorkshop.emit(id);
  }

  navToUrl(url , id) {
    this.router.navigate([url , id]);
  }

}
