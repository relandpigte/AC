import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import {
  CoursesServiceProxy,
  FileParameter,
  CourseDto,
  CurrenciesServiceProxy,
  CurrencyDto,
  SpokenLanguagesServiceProxy,
  SpokenLanguageDto,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseService } from '@app/courses/_services/course.service';
import { takeUntil, finalize, take } from 'rxjs/operators';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';

enum PricingState {
  Free,
  Charged,
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  model = new CourseDto();
  currencies: CurrencyDto[] = [];
  languages: SpokenLanguageDto[] = [];
  selectedCurrency: CurrencyDto = new CurrencyDto();
  isLoading = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  courseImage: FileParameter;
  defaultFile: DefaultFile;
  PricingState = PricingState;
  currenctPricingState = PricingState.Free;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
    private _currenciesService: CurrenciesServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._courseService.course$
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this.model = course;
        this.currenctPricingState = this.model.price > 0 ? PricingState.Charged : PricingState.Free;
        if (course.imageDocument) {
          if (!this.courseImage) {
            this.defaultFile = new DefaultFile();
            this.defaultFile.name = course.imageDocument.originalFileName;
            this.defaultFile.url = course.courseImageUrl;
            this.defaultFile.size = course.imageDocument.size;
            this.documentUploader.defaultFile = this.defaultFile;
          }
        }
      });

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.courseImage = files[0];
      } else {
        this.courseImage = undefined;
      }
    });

    this.getCurrencies();
    this.getLanguages();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._coursesService.updateDetails(
      this.model.name,
      this.model.subtitle,
      this.model.description,
      this.model.price,
      this.selectedCurrency.id,
      this.model.languageId,
      this.courseImage,
      this.model.id,
    )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this._courseService.course = course;
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  onCurrencyClick(currency: CurrencyDto): void {
    this.selectedCurrency = currency;
  }

  onPricingClick(pricingState: PricingState): void {
    this.currenctPricingState = pricingState;
    if (this.currenctPricingState === PricingState.Free) {
      this.model.price = 0;
    }
  }

  private getCurrencies(): void {
    this._currenciesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(currencies => {
        this.currencies = currencies;
        if (this.model.currencyId) {
          this.selectedCurrency = this.currencies.find(e => e.id === this.model.currencyId);
        } else {
          this.selectedCurrency = this.currencies.find(e => e.code === 'GBP');
        }
      });
  }

  private getLanguages(): void {
    this._spokenLanguagesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(languages => {
        this.languages = languages;
      });
  }
}
