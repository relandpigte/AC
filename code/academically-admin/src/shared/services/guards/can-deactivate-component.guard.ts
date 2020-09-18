import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ComponentCanDeactivate } from '../../models/can-deactivate/component-can-deactivate';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateComponentGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    return component.canDeactivate();
  }
}
