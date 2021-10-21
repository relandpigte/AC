import { Component, OnInit, Injector } from '@angular/core';
import { AuditLogsDto, AuditLogsServiceProxy, AuditLogsType, ServicesNameType } from '@shared/service-proxies/service-proxies';
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
  ServicesNameType = ServicesNameType
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
  jsonFilter(jsonString, inputKey): string {
    const jsonObj = JSON.parse(jsonString)
    var result;
    if(jsonObj['input']){
      result=this.findKeyJsonObj(jsonObj['input'],inputKey)
    }
    else if (jsonObj['inputs']){
      jsonObj['inputs'].forEach(element => {
        result=this.findKeyJsonObj(element,inputKey)
      });
    }
    return (result? "\""+result+"\"":"")
  }
  findKeyJsonObj(jsonObj,inputKey): string {
   
    const keys = Object.keys(jsonObj);
      for(let key of keys){
        if (key === inputKey) {
          return jsonObj[inputKey]
        }
      }
      jsonObj=Object.values(jsonObj)[0]
      if(jsonObj){
        if(jsonObj[inputKey]){
          return jsonObj[inputKey]
        }
      }
  }
}
