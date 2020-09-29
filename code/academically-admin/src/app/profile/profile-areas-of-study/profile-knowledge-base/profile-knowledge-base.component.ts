import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DisciplineTaxonomiesServiceProxy,
  DisciplineTaxonomyDto,
  GetUserDisciplineTaxonomyDto,
  UserProfilesServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Observer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'profile-knowledge-base',
  templateUrl: './profile-knowledge-base.component.html',
  styleUrls: ['./profile-knowledge-base.component.less'],
})
export class ProfileKnowledgeBaseComponent extends AppComponentBase implements OnInit {
  disciplineTaxonomyName: string;
  disciplineTaxonomiesDataSource: Observable<DisciplineTaxonomyDto[]>;
  userDisciplineTaxonomies: GetUserDisciplineTaxonomyDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy,
    private _userProfilesService: UserProfilesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
    this.getDiscplineTaxonomiesOfUser();
  }

  onTaxonomySelect(e: TypeaheadMatch): void {
    this.addDisciplineTaxonomyToUser(e.item.id);
  }

  onRemoveDisciplineTaxonomyClick(userDisciplineTaxonomyId: string) {
    this.removeDisciplineTaxonomyFromUser(userDisciplineTaxonomyId);
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomyName);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(query);
      })
    );
  }

  private getDiscplineTaxonomiesOfUser(): void {
    this.isLoading = true;
    this._userProfilesService.getDisciplineTaxonomies().subscribe((discplineTaxonomies) => {
      this.userDisciplineTaxonomies = discplineTaxonomies;
      this.isLoading = false;
    });
  }

  private addDisciplineTaxonomyToUser(disciplineTaxonomyId: string): void {
    this.isLoading = true;
    this._userProfilesService
      .createDisciplineTaxonomy(disciplineTaxonomyId)
      .pipe(
        finalize(() => {
          this.disciplineTaxonomyName = '';
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('TheAreaOfStudyWasAdded'));
        this.getDiscplineTaxonomiesOfUser();
      });
  }

  private removeDisciplineTaxonomyFromUser(userDisciplineTaxonomyId: string): void {
    this.isLoading = true;
    this._userProfilesService
      .deleteDisciplineTaxonomy(userDisciplineTaxonomyId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('TheAreaOfStudyWasRemoved'));
        this.getDiscplineTaxonomiesOfUser();
      });
  }
}
