import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem, ServiceCreateService } from '@shared/services/service-create.service';
import { Router } from '@angular/router';
import { EventStatus, ServicesType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.less'],
  animations: [appModuleAnimation()],
})
export class ServiceCreateComponent extends AppComponentBase implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  @Input() returnUrl: string;
  @Input() servicesType: ServicesType;
  @Input() model: any;

  @Output() onPublished = new EventEmitter<any>();
  @Output() onUnpublished = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  defaultMenuItem: MenuItem;
  displayInfoText = true;

  constructor(
    injector: Injector,
    private _router: Router,
    private _serviceCreateService: ServiceCreateService
  ) {
    super(injector);
  }

  get serviceTypeName(): string { return ServicesType[this.servicesType] ?? 'Service'; }
  get serviceName(): string { return this.model?.name; }
  get activeMenuName(): string { return this.defaultMenuItem?.label; }
  get isServicePublished(): boolean { return this.model?.status === EventStatus.Published; }
  get isServiceDraft(): boolean { return this.model?.status === EventStatus.Draft; }
  get activeInfoText(): string { return this.defaultMenuItem?.infoText; }


  ngOnInit(): void {
    this._serviceCreateService.getDefaultMenuItem().subscribe(x => this.defaultMenuItem = x);
  }

  setDefaultMenuItem(menu: MenuItem): void {
    this._serviceCreateService.setDefaultMenuItem(menu);
  }

  handlePublished(): void {
    this.onPublished.next(this.model);
  }

  handleUnpublished(): void {
    this.onUnpublished.next(this.model);
  }

  handleDelete(): void {
    this.onDelete.next(this.model);
  }

  onCloseInfoText(): void {
    this.displayInfoText = false;
  }

  async onProcessReturn(): Promise<void> {
    if (!this.returnUrl) {
      return;
    }
    await this._router.navigate([this.returnUrl]);
  }
}
