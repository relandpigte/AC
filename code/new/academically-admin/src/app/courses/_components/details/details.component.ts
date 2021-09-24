import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import {
  CoursesServiceProxy,
  FileParameter,
  CourseDto,
  CurrenciesServiceProxy,
  CurrencyDto,
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

  course = new CourseDto();
  currencies: CurrencyDto[] = [];
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
        this.course = course;
        this.currenctPricingState = this.course.price > 0 ? PricingState.Charged : PricingState.Free;
        if (course.imageDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = course.imageDocument.originalFileName;
          this.defaultFile.url = course.courseImageUrl;
          this.defaultFile.size = course.imageDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
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
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._coursesService.updateDetails(
      this.course.name,
      this.course.subtitle,
      this.course.description,
      this.course.price,
      this.selectedCurrency.id,
      this.courseImage,
      this.course.id,
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
      this.course.price = 0;
    }
  }

  private getCurrencies(): void {
    this._currenciesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(currencies => {
        this.currencies = currencies;
        if (this.course.currencyId) {
          this.selectedCurrency = this.currencies.find(e => e.id === this.course.currencyId);
        } else {
          this.selectedCurrency = this.currencies.find(e => e.code === 'GBP');
        }
      });
  }
}
