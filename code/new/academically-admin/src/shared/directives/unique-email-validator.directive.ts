import { Directive, forwardRef, ElementRef } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { RegistrationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
  selector:
    '[uniqueEmail][formControlName],[uniqueEmail][formControl],[uniqueEmail][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueEmailValidator),
      multi: true
    }
  ]
})
export class UniqueEmailValidator implements AsyncValidator {
  warningEl: HTMLSpanElement;

  constructor(
    private _el: ElementRef,
    private _registrationsService: RegistrationsServiceProxy,
  ) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.warningEl) {
      this.warningEl.remove();
    }
    const inputEl = this._el.nativeElement as HTMLInputElement;
    const parentEl = inputEl.parentElement as HTMLDivElement;
    let loaderEl;
      if(parentEl.childNodes[0]['className'].indexOf('spinner-border')==-1){
        loaderEl = document.createElement('span');
        loaderEl.classList.add('spinner-border');
        loaderEl.classList.add('text-primary');
        loaderEl.classList.add('input-icon');
        parentEl.prepend(loaderEl);
      }
    const value = control.value;
    if (value) {
      return this._registrationsService.checkEmailUniqueness(control.value).pipe(
        map(result => {
          if (result) {
            if (!parentEl.classList.contains('input-group-merge')) {
              this.warningEl = document.createElement('span');
              this.warningEl.classList.add('fe');
              this.warningEl.classList.add('fe-alert-triangle');
              this.warningEl.classList.add('text-danger');
              this.warningEl.classList.add('input-icon');
              parentEl.prepend(this.warningEl);
            }
            return { emailTaken: true };
          } else {
            if(parentEl.childNodes[0]['className'].indexOf('spinner-border')==0 && loaderEl==undefined){
              parentEl.childNodes[0].remove();
            }
            else{
              parentEl.childNodes[1]['classList'].remove('is-invalid')
              loaderEl.remove();
            }
          }
        })
      );
    }
  }
}
