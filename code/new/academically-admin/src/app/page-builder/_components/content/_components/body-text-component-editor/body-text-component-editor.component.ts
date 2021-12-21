import { Component, OnInit, Input } from '@angular/core';
import { BodyTextComponentContet } from '../../_models/body-text-component-content';

@Component({
  selector: 'app-body-text-component-editor',
  templateUrl: './body-text-component-editor.component.html',
  styleUrls: ['./body-text-component-editor.component.less']
})
export class BodyTextComponentEditorComponent implements OnInit {
  @Input() component: BodyTextComponentContet;

  constructor() { }

  ngOnInit(): void {
  }

}
