import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { SubjectsServiceProxy, SubjectSuggestionDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-subjects',
  templateUrl: './service-subjects.component.html',
  styleUrls: ['./service-subjects.component.less'],
  animations: [appModuleAnimation()],
})
export class ServiceSubjectsComponent extends AppComponentBase implements OnInit {
  services: string[];
  subjectSuggestions: SubjectSuggestionDto[] = [];
  serviceSubjects: SubjectSuggestionDto[] = [];
  selectedService: string;
  isLoading = false;

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    private _subjectsService: SubjectsServiceProxy,
  ) {
    super(injector);
    activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('service-name')) {
        this.selectedService = paramMap.get('service-name');
      }
      this.getSuggestions();
    });
  }

  ngOnInit(): void {
  }

  onServiceClick(service: string): void {
    this.getServiceSubjects(service);
  }

  onApproveClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this._subjectsService.approveSuggestion(id)
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isLoading = false;
              }),
            )
            .subscribe(() => {
              this.notify.success(this.l('SubjectSuggestionApprovedMessage'));
              this.getSuggestions();
            });
        }
      }
    );
  }

  onRejectClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this._subjectsService.rejectSuggestion(id)
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isLoading = false;
              }),
            )
            .subscribe(() => {
              this.notify.success(this.l('SubjectSuggestionRejectedMessage'));
              this.getSuggestions();
            });
        }
      }
    );
  }

  private getSuggestions(): void {
    this.isLoading = true;
    this._subjectsService.getSuggestions()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(suggestions => {
        this.subjectSuggestions = suggestions;
        this.services = _.uniq(_.map(suggestions, suggestion => suggestion.serviceName));
        if (this.services && this.services.length) {
          const selectedService = this.selectedService ? this.selectedService : this.services[0];
          this.getServiceSubjects(selectedService);
          if (this.serviceSubjects.length === 0) {
            this.selectedService = this.services[0];
            this.getServiceSubjects(this.selectedService);
          }
        } else {
          this.selectedService = undefined;
          this.serviceSubjects = [];
        }
      });
  }

  private getServiceSubjects(service: string): void {
    this.selectedService = service;
    this.serviceSubjects = _.filter(this.subjectSuggestions, subjectSuggestion => subjectSuggestion.serviceName === this.selectedService);
  }
}
