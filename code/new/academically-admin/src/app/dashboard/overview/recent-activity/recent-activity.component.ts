import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AuditLogsDto, AuditLogsType, ServicesNameType, AuditLogsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.less']
})
export class RecentActivityComponent extends AppComponentBase implements OnInit {
  auditlogs: AuditLogsDto[];
  isLoading = false;
  AuditLogsType = AuditLogsType;
  ServicesNameType = ServicesNameType;
  constructor(
    injector: Injector,
    private _auditLogsService: AuditLogsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAuditLogs();
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

  jsonFilter(jsonString, inputKey): string {
    try {
      const jsonObj = JSON.parse(jsonString);
      let result;
      if (jsonObj['input']) {
        result = this.findKeyJsonObj(jsonObj['input'], inputKey);
      } else if (jsonObj['inputs']) {
        jsonObj['inputs'].forEach(element => {
          result = this.findKeyJsonObj(element, inputKey);
        });
      }
      return (result ? '"' + result + '"' : '');
    } catch (error) {
      console.log('can\'t parse: ' + jsonString);
    }
  }

  findKeyJsonObj(jsonObj, inputKey): string {
    const keys = Object.keys(jsonObj);
    for (const key of keys) {
      if (key === inputKey) {
        return jsonObj[inputKey];
      }
    }
    jsonObj = Object.values(jsonObj)[0];
    if (jsonObj) {
      if (jsonObj[inputKey]) {
        return jsonObj[inputKey];
      }
    }
  }
}
