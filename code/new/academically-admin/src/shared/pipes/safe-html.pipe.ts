import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private _sanitized: DomSanitizer) { }
  transform(value: string) {
    return this._sanitized.bypassSecurityTrustHtml(value);
  }
}
