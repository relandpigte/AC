import { Component, Injector, OnInit } from '@angular/core';
import { TaxonomySearchComponent } from '@app/shared/taxonomy-search/taxonomy-search.component';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DisciplineTaxonomiesServiceProxy,
  DisciplineTaxonomyDto,
  GetAllDisciplineTaxonomyDto,
  GetUserDisciplineTaxonomyDto,
  UserProfilesServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
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
    private _userProfilesService: UserProfilesServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
    this.getDiscplineTaxonomiesOfUser();
  }

  onTaxonomySelect(e: TypeaheadMatch): void {
    this.addDisciplineTaxonomiesToUser([e.item.id]);
  }

  onRemoveDisciplineTaxonomyClick(userDisciplineTaxonomyId: string) {
    this.removeDisciplineTaxonomyFromUser(userDisciplineTaxonomyId);
  }

  onAddAreaOfStudyClick(): void {
    this.showTaxonomySearchModal();
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomyName);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(this.appSession.userId, query);
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

  private addDisciplineTaxonomiesToUser(disciplineTaxonomyIds: string[]): void {
    this.isLoading = true;
    this._userProfilesService
      .createManyDisciplineTaxonomy(disciplineTaxonomyIds)
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

  private showTaxonomySearchModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    modalSettings.initialState = {
      userId: this.appSession.userId,
    };
    const modalRef = this._modalService.show(TaxonomySearchComponent, modalSettings);
    const modal: TaxonomySearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedTaxonomies: GetAllDisciplineTaxonomyDto[]) => {
      const taxonomyIds = selectedTaxonomies.map((e) => e.id);
      this.addDisciplineTaxonomiesToUser(taxonomyIds);
    });
  }
}
