import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { countries } from "@shared/constants/countries";
import {
  WorkHistoriesServiceProxy,
  WorkHistoryDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-add-experience",
  templateUrl: "./add-experience.component.html",
})
export class AddExperienceComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  model: WorkHistoryDto = new WorkHistoryDto();

  countries = countries;
  years: { label: string, value: number }[] = [];

  isLoading = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _workHistoryService: WorkHistoriesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
      this.initOptions();
  }

  private initOptions(): void {
    const currYear = this.convertToUserDate(new Date()).getFullYear();

    this.years.push({ label: "Present", value: currYear });
    for (let year = currYear - 1; year >= 1922; year--) {
      this.years.push({ label: year.toString(), value: year });
    }
  }

  onFormSubmit() {
    this.isLoading = true;
    if (this.model)
    this._workHistoryService.create(this.model)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(() => {
      this.notify.info(this.l("SavedSuccessfully"));
      this._modal.hide();
      this.onSave.emit();
    });
  }

  onCloseClick() {
    this._modal.hide();
  }
}
