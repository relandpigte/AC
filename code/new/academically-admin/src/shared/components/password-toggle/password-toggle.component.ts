import { Component, ElementRef, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-toggle',
  templateUrl: './password-toggle.component.html',
  styleUrls: ['./password-toggle.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordToggleComponent),
      multi: true,
    }
  ]
})
export class PasswordToggleComponent implements ControlValueAccessor {
  @Input() password: string;
  @Input() placeholder: string;
  @Output() elementRef: ElementRef;
  isPasswordVisible = false;

  constructor(el: ElementRef) {
    this.elementRef = el;
  }

  onChange = (_: any) => { };
  onTouched: () => void = () => { };

  writeValue(password: string) {
    this.password = password;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  updateChanges() {
    this.onChange(this.password);
  }
}
