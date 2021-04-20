import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EducationLevelDto, EducationLevelsServiceProxy, UserEducationLevelDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-edit-education-level',
  templateUrl: './create-edit-education-level.component.html',
  styleUrls: ['./create-edit-education-level.component.less']
})
export class CreateEditEducationLevelComponent implements OnInit {
  @Output() userEducationLevelSaved = new EventEmitter<UserEducationLevelDto>();
  model: UserEducationLevelDto = new UserEducationLevelDto();
  educationLevels: EducationLevelDto[] = [];

  constructor(
    private _modal: BsModalRef,
    private _educationLevelsService: EducationLevelsServiceProxy,
  ) { }

  ngOnInit(): void {
    this.getEducationLevels();
    if (!this.model) {
      this.model = new UserEducationLevelDto();
    }
  }

  onFormSubmit(): void {
    this.model.educationLevelName = this.educationLevels.find(e => e.id === this.model.educationLevelId).shortName;
    this.userEducationLevelSaved.emit(this.model);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  private getEducationLevels(): void {
    this._educationLevelsService.getAll()
      .subscribe(educationLevels => {
        this.educationLevels = educationLevels;
      })
  }
}
