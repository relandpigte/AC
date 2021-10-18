import { Component, OnInit, Injector } from '@angular/core';
import { AuditLogsDto, AuditLogsServiceProxy, AuditLogsType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.less']
})
export class RecentActivityComponent extends AppComponentBase implements OnInit {
  auditlogs: AuditLogsDto[];
  isLoading = false;
  AuditLogsType = AuditLogsType
  constructor(
    injector: Injector,
    private _auditLogsService: AuditLogsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAuditLogs()
  }
  getAuditLogs(): void {
    this.isLoading = true;
    this._auditLogsService.get()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(auditlogs => {
        this.auditlogs = auditlogs;
      });
  }
}
