import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { TaxonomySearchComponent } from '@app/shared/taxonomy-search/taxonomy-search.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DisciplineTaxonomiesServiceProxy,
  DisciplineTaxonomyDto,
  GetAllDisciplineTaxonomyDto,
  SupportLevelDto,
  UserTutorialDto,
  UserTutorialsServiceProxy,
  FileParameter
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
@Component({
  selector: 'peer-support-tutorial',
  templateUrl: './peer-support-tutorial.component.html',
  styleUrls: ['./peer-support-tutorial.component.less'],
  animations: [appModuleAnimation()]
})
export class PeerSupportTutorialComponent extends AppComponentBase implements OnInit {
  @ViewChild('tutorialPictureInput', { static: true }) tutorialPictureInput: ElementRef;

  disciplineTaxonomyName = '';
  disciplineTaxonomiesDataSource: Observable<DisciplineTaxonomyDto[]>;
  selectedDisciplineTaxonomies: DisciplineTaxonomyDto[] = [];
  userTutorials: UserTutorialDto;
  supportLevels: SupportLevelDto[];
  datePickerConfig: BsDatepickerConfig;
  tutorialPicturePlaceholderText: string;
  fileUploadSettings = fileUploadConfiguration;
  picture: FileParameter;

  constructor(
    injector: Injector,
    private _disciplineTaxonomiesService: DisciplineTaxonomiesServiceProxy,
    private _userTutorialsService: UserTutorialsServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.tutorialPicturePlaceholderText = this.imageUploadPlaceholderText;
    this.userTutorials = new UserTutorialDto();
  }

  ngOnInit(): void {
    this.getDisciplineTaxonomies();
    this.getSupportLevels();
  }

  onTaxonomySelect(e: TypeaheadMatch): void {
    const disciplineTaxonomy: DisciplineTaxonomyDto = e.item;
    const index = this.selectedDisciplineTaxonomies.findIndex(t => t.id === disciplineTaxonomy.id);
    if (index < 0) {
      this.selectedDisciplineTaxonomies.push(disciplineTaxonomy);
    }
    this.disciplineTaxonomyName = '';
  }

  onRemoveDisciplineTaxonomyClick(id: string): void {
    const index = this.selectedDisciplineTaxonomies.findIndex(e => e.id === id);
    if (index > -1) {
      this.selectedDisciplineTaxonomies.splice(index, 1);
    }
  }

  onBrowseSkillsClick(): void {
    this.showTaxonomySearchModal();
  }

  onFileChange(files: FileList): void {
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
          this.userTutorials.picture = reader.result.toString();
        };
        this.tutorialPicturePlaceholderText = file.name;
        this.picture = {
          fileName: file.name,
          data: file
        };
      } else {
        this.clearUploader();
      }
    }
  }

  private getDisciplineTaxonomies(): void {
    this.disciplineTaxonomiesDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.disciplineTaxonomyName);
    }).pipe(
      switchMap((query: string) => {
        return this._disciplineTaxonomiesService.search(undefined, query);
      })
    );
  }

  private showTaxonomySearchModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    const modalRef = this._modalService.show(TaxonomySearchComponent, modalSettings);
    const modal: TaxonomySearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedTaxonomies: GetAllDisciplineTaxonomyDto[]) => {
      selectedTaxonomies.forEach(e => {
        const index = this.selectedDisciplineTaxonomies.findIndex(t => t.id === e.id);
        if (index < 0) {
          const taxonomy = new DisciplineTaxonomyDto();
          taxonomy.id = e.id;
          taxonomy.name = e.name;
          this.selectedDisciplineTaxonomies.push(taxonomy);
        }
      });
    });
  }

  private getSupportLevels(): void {
    this._userTutorialsService.getSupportLevels().subscribe(supportLevels => {
      this.supportLevels = supportLevels;
      console.log(this.supportLevels);
    });
  }
  private validateFile(file: File): boolean {
    const invalidUploadMessageTitle = this.l('InvalidFileUploadErrorTitle');

    if (!this.validateFileExtension(file)) {
      this.message.error(this.l('InvalidFileExtensionUploadError'), invalidUploadMessageTitle, true);
      return false;
    }

    if (!this.validateFileSize(file.size, this.fileUploadSettings.profilePictureMaxFileSize)) {
      this.message.error(this.l('ProfilePictureFileSizeUploadError'), invalidUploadMessageTitle, true);
      return false;
    }

    return true;
  }

  private validateFileSize(size: number, maxLimit: number) {
    return size <= maxLimit;
  }

  private validateFileExtension(file: File): boolean {
    const fileExtension = this.getFileExtension(file.name).toLocaleLowerCase();
    const index = this.fileUploadSettings.allowedExtensions.indexOf(`.${fileExtension}`);
    return index >= 0;
  }

  private getFileExtension(fileName: string): string {
    const fileNameArray = fileName.split('.');
    return fileNameArray[fileNameArray.length - 1];
  }
  private clearUploader(): void {
    this.tutorialPictureInput.nativeElement.value = '';
    this.tutorialPicturePlaceholderText = this.imageUploadPlaceholderText;
  }
}
